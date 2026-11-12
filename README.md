<div align="center">

# Mach Coffee Co.
<div align="center">

![README Banner](images/mach-coffee-co.-banner.png)
Concept website for Mach Coffee Co. — an aviation-themed coffee shop.

**Status:** Concept / pre-launch. Not yet a registered business.

## License

All rights reserved. See `LICENSE` for details. This is a private project —
no permission is granted to use, copy, or distribute any part of this site.

## Development

The site is built with Jekyll. Shared markup lives in `_layouts/default.html`
and `_includes/` (`head`, `header`, `footer`, `favicon-animation`); each page
only contains front matter and its own content. Page-specific CSS goes in
`assets/css/pages/<name>.css` and is enabled with `page_css: <name>` in the
page's front matter.

```bash
bundle install
bundle exec jekyll serve --baseurl ""
```
