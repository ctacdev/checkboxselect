const fieldsetTemplate = require("../html/fieldset.handlebars");
const checkboxTemplate = require("../html/checkbox.handlebars");

export class CheckboxSelect {

  constructor(options = {}) {

    if (options.targetContainerId && Object.keys(options).length == 1) {

      const targetContainer = document.getElementById(options.targetContainerId);

      options.legend = targetContainer.getAttribute('data-legend');
      options.fieldName = targetContainer.getAttribute('data-field-name');
      options.noItemsText = targetContainer.getAttribute('data-no-items-text');
      options.expandedIcon = targetContainer.getAttribute('data-expanded-icon');
      options.collapsedIcon = targetContainer.getAttribute('data-collapsed-icon');

      const onItemSelected = targetContainer.getAttribute('data-on-item-selected');
      const onItemDeselected = targetContainer.getAttribute('data-on-item-deselected');
      options.onItemSelected = item => this.toggleItem(item, this, onItemSelected, true);
      options.onItemDeselected = item => this.toggleItem(item, this, onItemDeselected, true);
    }

    if (!options.onItemSelected) options.onItemSelected = () => {};
    if (!options.onItemDeselected) options.onItemDeselected = () => {};

    if (options.expandedIcon == null || options.expandedIcon == undefined) options.expandedIcon = '▼';
    if (options.collapsedIcon == null || options.collapsedIcon == undefined) options.collapsedIcon = '◀';

    if (!options.fieldsetTemplate) options.fieldsetTemplate = fieldsetTemplate;
    if (!options.checkboxTemplate) options.checkboxTemplate = checkboxTemplate;

    if (!options.noItemsText) options.noItemsText = 'No items found';
    if (!options.legend) options.legend = 'ITEMS';
    if (!options.fieldName) options.fieldName = 'items[]';

    Object.assign(this, options);

    if (this.targetContainerId) {
      this.targetDiv = document.getElementById(this.targetContainerId);
    } else {
      this.targetDiv = document.getElementsByClassName('js-checkbox-select-container')[0];
    }
  }

  toggleItem(item, checkboxSelect, functionString) {

    const script  =  document.createElement('script');
    script.innerHTML = `var call = ${functionString}; call(${JSON.stringify(item)});`
    document.getElementsByTagName('body')[0].append(script);
  }

  getCheckboxes() {

    const items = Object.entries(this.items);

    if (items.length == 0) return `<div class="empty-filters-text">${this.noItemsText}</div>`;

    return items.map(item => {

      return this.checkboxTemplate({
        fieldName: this.fieldName,
        value: item[1],
        name: item[0],
        checked: this.selectedItems.includes(item[1].toString()) ? 'checked' : ''
      });
    }).join('\n');
  }

  toggleMultiselectExpand(e, checkboxSelect) {

    if (e.type === 'keydown' && e.code !== 'Space') return;

    const legend = this.targetDiv.getElementsByClassName('legend-container')[0];
    const checkboxes = this.targetDiv.getElementsByClassName('checkboxes-container')[0];
    let arrow = legend.getElementsByClassName('arrow-down')[0];

    if (arrow) {

      arrow.classList.remove('arrow-down');
      arrow.classList.add('arrow-left');
      arrow.innerHTML = checkboxSelect.collapsedIcon;
      checkboxes.style.display = 'none';

    } else {

      arrow = legend.getElementsByClassName('arrow-left')[0];
      arrow.classList.remove('arrow-left');
      arrow.classList.add('arrow-down');
      arrow.innerHTML = checkboxSelect.expandedIcon;
      checkboxes.style.display = 'block';
    }
  }

  onCheckboxChanged(input, checkboxSelect) {

    const itemNames = Object.keys(checkboxSelect.items);
    const itemName = itemNames.find(itemName => checkboxSelect.items[itemName] == input.value);
    const item = {};
    item[itemName] = input.value;

    if (input.checked) this.onItemSelected(item);
    else this.onItemDeselected(item);
  }

  init(items = {}, selectedItems) {

    this.items = items || {};
    this.selectedItems = selectedItems || [];

    if (typeof this.selectedItems === 'string') { this.selectedItems = [selectedItems]; } 

    const itemNames = Object.keys(this.items);

    this.targetDiv.innerHTML = this.fieldsetTemplate({
      legend: this.legend,
      arrow: itemNames.length == 0 ? this.collapsedIcon : this.expandedIcon,
      checkboxes: this.getCheckboxes()
    });

    if (itemNames.length == 0) {

      this.targetDiv.getElementsByClassName('checkboxes-container')[0].classList.add('collapse');

      const iconContainer = this.targetDiv.getElementsByClassName('arrow-down')[0];
      iconContainer.classList.remove('arrow-down');
      iconContainer.classList.add('arrow-left');
    }

    const legendContainer = this.targetDiv.getElementsByClassName('legend-container')[0];
    legendContainer.addEventListener('keydown', e => this.toggleMultiselectExpand(e, this));
    legendContainer.addEventListener('click', e => this.toggleMultiselectExpand(e, this));

    Array.from(this.targetDiv.getElementsByClassName('checkbox-container')).forEach(container => {

      const input = container.getElementsByTagName('input')[0];
      input.addEventListener('change', () => this.onCheckboxChanged(input, this));

      container.addEventListener('click', e => {

        if (e.target.nodeName === 'DIV') {

          input.checked = !input.checked;
          this.onCheckboxChanged(input, this);
        }
      });
    });
  }
}
