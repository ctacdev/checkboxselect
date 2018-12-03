## Install
`git clone http://repo.com`

`npm install`

## Local development

### Start webpack dev server
`node_modules/.bin/webpack-dev-server`

[http://localhost:9000](http://localhost:9000)

### Build the distribution
`node_modules/.bin/webpack`

## Usage
```HTML
<!DOCTYPE html>
<html>
  <body>
    <div id="animals-container" class="checkbox-select-container" style="width: 150px;"></div>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        new CheckboxSelect({
          targetContainerId: 'animals-container',
          legend: 'ANIMALS',
          fieldName: 'animals[]',
          onItemSelected: item => { console.log(item) },
          onItemDeselected: item => { console.log(item) },
          leftArrow: '◀',
          downArrow: '▼',
          noItemsText: 'no animals found'
        }).init({
          'ant' : 1,
          'baboon': 2,
          'crow': 3,
          'deer': 4,
          'eagle': 5,
          'fox': 6,
          'goose': 7,
          'hare': 8,
          'iguana': 9,
          'jaguar': 10
        }, [1,3,9]);
      });
    </script>
  </body>
</html>
```

The example above would render:

*when open:*

![example when opened](./docs/open.png)

*when closed:*

![example when closed](./docs/closed.png)
