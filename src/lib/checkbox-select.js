export class CheckboxSelect {

  constructor(options = {}) {

    if (!options.onItemSelected) options.onItemSelected = () => {};
    if (!options.onItemDeselected) options.onItemDeselected = () => {};

    if (!options.downArrow) options.downArrow = '▼';
    if (!options.leftArrow) options.leftArrow = '◀';

    if (!options.noItemsText) options.noItemsText = 'No items found';

    this.fieldsetTemplate = require("../html/fieldset.handlebars");
    this.checkboxTemplate = require("../html/checkbox.handlebars");

    Object.assign(this, options);

    if (this.targetContainerId) {
      this.targetDiv = document.getElementById(this.targetContainerId);
    } else {
      this.targetDiv = document.getElementsByClassName('checkbox-select-container')[0];
    }
  }

  getCheckboxes() {

    const itemNames = Object.keys(this.items)

    if (!this.items || itemNames.length == 0) return `<div class="empty-filters-text">${this.noItemsText}</div>`;

    return itemNames.map(itemName => {

      return this.checkboxTemplate({
        fieldName: this.fieldName,
        value: this.items[itemName],
        name: itemName,
        checked: this.selectedItems.includes(this.items[itemName]) ? 'checked' : ''
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
      arrow.innerHTML = checkboxSelect.leftArrow;
      checkboxes.style.display = 'none';

    } else {

      arrow = legend.getElementsByClassName('arrow-left')[0];
      arrow.classList.remove('arrow-left');
      arrow.classList.add('arrow-down');
      arrow.innerHTML = checkboxSelect.downArrow;
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

  init(items = {}, selectedItems = []) {

    this.items = items;
    this.selectedItems = selectedItems || [];
    this.targetDiv.innerHTML = this.fieldsetTemplate({
      legend: this.legend,
      arrow: this.downArrow,
      checkboxes: this.getCheckboxes()
    });

    const legendContainer = this.targetDiv.getElementsByClassName('legend-container')[0];
    legendContainer.addEventListener('keydown', e => this.toggleMultiselectExpand(e, this));
    legendContainer.addEventListener('click', e => this.toggleMultiselectExpand(e, this));

    Array.from(this.targetDiv.getElementsByClassName('checkbox-container')).forEach(container => {

      const input = container.getElementsByTagName('input')[0];
      input.addEventListener('change', () => this.onCheckboxChanged(input, this));

      container.addEventListener('click', e => {

        if (e.target.nodeName == 'DIV') {

          input.checked = !input.checked;
          this.onCheckboxChanged(input, this);
        }
      });
    });
  }
}
