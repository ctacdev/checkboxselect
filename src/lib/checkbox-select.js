export class CheckboxSelect {

  constructor(options) {

    this.downArrow = '▼';
    this.leftArrow = '◀';

    Object.assign(this, options);
  }

  getCheckbox(item) {
    return `<div class="checkbox-container">
              <label>
                <input type="checkbox"
                  name="${item.name}[]"
                  value="${item.value}"
                  id="${item.name}_${item.value}"
                  ${this.selectedOptions.includes(item.value) ? 'checked' : ''}
                %>
                ${item.name}
              </label>
            </div>`;
  }

  getCheckboxes() {

    if (!this.items || this.items.length == 0) {

      return `<div class="checkboxes-container">
                <div class="empty-filters-text">No items found.</div>
              </div>`;
    } else {

      let html = '<div class="checkboxes-container">';
      this.items.forEach(item => html = html.concat(this.getCheckbox(item)));
      return html + '</div>';
    }
  }

  getFieldSet() {
    return `<fieldset>
              <div class="legend-container">
                <legend tabindex="0">${this.legend}<div class="arrow-down">${this.downArrow}</div></legend>
              </div>
              ${this.getCheckboxes()}
            </fieldset>`;
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
    this.targetDiv.innerHTML = this.getFieldSet();

    const legendContainer = document.getElementsByClassName('legend-container')[0];
    legendContainer.addEventListener('keydown', e => this.toggleMultiselectExpand(e, this));
    legendContainer.addEventListener('click', e => this.toggleMultiselectExpand(e, this));
  }
}
