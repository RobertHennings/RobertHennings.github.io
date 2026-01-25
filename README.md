# Personal Website (based on Academic Pages Layout)

## Repository Structure

The single subpages that appear in the main top positioned navigation bar have to be named and inlcuded accordingly.

The order and their appearing name, as well as the shown url is defined in:

```zsh
_data/navigation.yaml
```

All principial subpages have to be included in the _pages subfolder.

The contents of the single listed subpages in the navigation bar originate from the respective folders, where collection of subpages are stored:

- _publications
- _talks
- _teaching
- _portfolio
- _posts

The brief introductary sidebar content is defined in:

```zsh
_data/cv.json
```

The other main settings are found in:

```zsh
_config.yaml_
```

Static Files that shall be included:

```zsh
/files/
```
