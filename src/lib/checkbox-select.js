export class CheckboxSelect {

  constructor(options) {
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
                <legend tabindex="0">${this.legend}<div class="arrow-down"></div></legend>
              </div>
              ${this.getCheckboxes()}
            </fieldset>`;
  }

  init(items = [], selectedOptions = []) {

    this.items = items;
    this.selectedOptions = selectedOptions || [];
    this.targetDiv.innerHTML = this.getFieldSet();
  }
}

// <fieldset>
//   <div class="multiselect-control-legend">
//     <legend tabindex="0"><%= legend %></legend><i class="fas fa-caret-down"></i>
//   </div>
//   <div class="multiselect-control-checkboxes" style="display: block;">
//     <% if items.blank? %>
//       <div class="empty-filters-text">No <%= simple_pluralize(0, legend).downcase %> found for this search.</div>
//     <% else %>
//       <% items.each do |item| %>
//         <div class="multiselect-control-checkbox">
//           <label>
//             <% checked = params[param].try(:include?, item.id.to_s) %>
//             <input type="checkbox" name="<%= param.to_s %>[]" value="<%= item.id %>" id="<%= param.to_s %>_<%= item.id %>" <%= 'checked' if checked %>>
//             <%= item.name %>
//           </label>
//         </div>
//       <% end %>
//     <% end %>
//   </div>
// </fieldset>
