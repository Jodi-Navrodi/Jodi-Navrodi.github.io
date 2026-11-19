"""Regenerate tiny, alpha-preserving previews; never recompress interface PNGs.

Run from the repository root with Pillow installed. Decorative WebPs are lossless.
"""
from pathlib import Path
from html import unescape
from PIL import Image, ImageChops, ImageFilter
import base64
import io
import json
import re

DECORATIVE = (
    'agromatrix/hero-field-v10',
    'agromatrix/hero-laptop-v10',  # The source deliberately blurs the unreleased UI.
    'flowey/hero-background-vfinal',
)


def prepare():
    report = []
    for name in DECORATIVE:
        source = Path('assets') / (name + '.png')
        target = source.with_suffix('.webp')
        with Image.open(source) as original:
            original.save(target, 'WEBP', lossless=True, exact=True, method=6)
            with Image.open(target) as converted:
                assert original.size == converted.size
                assert original.getchannel('A').tobytes() == converted.getchannel('A').tobytes()
                for background in ('black', 'white'):
                    def composite(image):
                        canvas = Image.new('RGBA', image.size, background)
                        return Image.alpha_composite(canvas, image.convert('RGBA')).convert('RGB')
                    assert ImageChops.difference(composite(original), composite(converted)).getbbox() is None
        report.append(dict(file=target.as_posix(), original=source.stat().st_size, webp=target.stat().st_size))

    for case in ('agromatrix', 'cryptopulse', 'loca', 'flowey'):
        page = Path(case) / 'index.html'
        text = page.read_text(encoding='utf-8')
        for name in DECORATIVE:
            text = text.replace('/assets/' + name + '.png', '/assets/' + name + '.webp')
        count = 0

        def image_tag(match):
            nonlocal count
            tag = match.group()
            src = re.search(r'\bsrc="([^"]+)"', tag)
            if not src or not src[1].startswith('/assets/' + case + '/') or not src[1].endswith('.png'):
                return tag
            source = Path(unescape(src[1]).lstrip('/'))
            with Image.open(source) as full:
                tiny = full.convert('RGBA')
                tiny.thumbnail((20, 20), Image.Resampling.LANCZOS)
                tiny = tiny.filter(ImageFilter.GaussianBlur(.65))
                out = io.BytesIO()
                tiny.save(out, 'WEBP', quality=35, method=6)
                preview = 'data:image/webp;base64,' + base64.b64encode(out.getvalue()).decode('ascii')
            tag = re.sub(r' data-case-preview="[^"]*"', '', tag)
            tag = re.sub(r' decoding="[^"]*"', '', tag)
            # Only the primary hero is eager. Other gallery items can be below
            # the first viewport on phones; native lazy loading handles that.
            gallery = text.rfind('hero-gallery', 0, match.start())
            first_hero = gallery > text.rfind('case-nav', 0, match.start()) and '</figure>' not in text[gallery:match.start()]
            hero = bool(re.search(r'class="[^"]*(?:agro-hero|flow-hero)', tag)) or first_hero
            tag = re.sub(r' loading="[^"]*"', '', tag)
            tag = tag[:-1] + f' loading="{"eager" if hero else "lazy"}" decoding="async" data-case-preview="{preview}">'
            count += 1
            return tag

        text = re.sub(r'<img\b[^>]*>', image_tag, text)
        if '/case-images.js' not in text:
            text = text.replace('</head>', '<link rel="stylesheet" href="/case-images.css?v=1"><script>document.documentElement.classList.add("case-images-js")</script><script src="/case-images.js?v=1" defer onerror="document.documentElement.classList.remove(\'case-images-js\')"></script></head>')
        page.write_text(text, encoding='utf-8', newline='\r\n')
        print(f'{case}: {count} PNG previews')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    prepare()
