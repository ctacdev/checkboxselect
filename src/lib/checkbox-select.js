export class CheckboxSelect {

  constructor(options) {

    this.downArrow = '▼';
    this.leftArrow = '◀';

    this.fieldsetTemplate = require("../html/fieldset.handlebars");
    this.checkboxTemplate = require("../html/checkbox.handlebars");

    Object.assign(this, options);
  }

  getCheckboxes() {

    if (!this.items || this.items.length == 0) return '<div class="empty-filters-text">No items found.</div>';

    return this.items.map(item => {

      return this.checkboxTemplate({
        fieldName: this.fieldName,
        value: item.value,
        name: item.name,
        checked: this.selectedOptions.includes(item.value) ? 'checked' : ''
      });
    }).join('\n');
  }

  toggleMultiselectExpand(e, checkboxSelect) {

    if (e.type === 'keydown' && e.code !== 'Space') return;

    const legend = document.getElementsByClassName('legend-container')[0];
    const checkboxes = document.getElementsByClassName('checkboxes-container')[0];
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

    e.preventDefault();
  }

  init(items = [], selectedOptions = []) {

    this.items = items;
    this.selectedOptions = selectedOptions || [];
    this.targetDiv.innerHTML = this.fieldsetTemplate({
      legend: this.legend,
      downArrow: this.downArrow,
      checkboxes: this.getCheckboxes()
    });

    const legendContainer = document.getElementsByClassName('legend-container')[0];
    legendContainer.addEventListener('keydown', e => this.toggleMultiselectExpand(e, this));
    legendContainer.addEventListener('click', e => this.toggleMultiselectExpand(e, this));
  }
}
