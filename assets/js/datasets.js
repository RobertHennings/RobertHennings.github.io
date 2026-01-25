/**
 * Datasets Interactive Table JavaScript
 * Handles filtering and sorting for the datasets table
 */

(function () {
    'use strict';

    function initDatasets() {
        var table = document.getElementById('datasets-table');
        var tbody = document.getElementById('datasets-tbody');

        if (!table || !tbody) {
            return;
        }

        var rows = Array.prototype.slice.call(tbody.querySelectorAll('.dataset-row'));
        var searchInput = document.getElementById('dataset-search');
        var categoryFilter = document.getElementById('category-filter');
        var typeFilter = document.getElementById('type-filter');
        var noResults = document.getElementById('no-results');
        var visibleCount = document.getElementById('visible-count');

        if (!searchInput || !categoryFilter || !typeFilter) {
            return;
        }

        // Collect unique categories
        var categoriesSet = {};

        rows.forEach(function (r) {
            if (r.dataset.category) {
                categoriesSet[r.dataset.category] = true;
            }
        });

        var categories = Object.keys(categoriesSet).sort();

        // Populate category filter
        categories.forEach(function (cat) {
            var option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        // Filter function
        function filterDatasets() {
            var searchTerm = searchInput.value.toLowerCase();
            var categoryValue = categoryFilter.value;
            var typeValue = typeFilter.value;

            var visibleDatasets = 0;

            rows.forEach(function (row) {
                var name = row.dataset.name || '';
                var description = row.dataset.description || '';
                var source = row.dataset.source || '';
                var category = row.dataset.category || '';
                var type = row.dataset.type || '';

                var matchesSearch = !searchTerm ||
                    name.indexOf(searchTerm) !== -1 ||
                    description.indexOf(searchTerm) !== -1 ||
                    source.indexOf(searchTerm) !== -1;
                var matchesCategory = !categoryValue || category === categoryValue;
                var matchesType = !typeValue || type === typeValue;

                if (matchesSearch && matchesCategory && matchesType) {
                    row.style.display = '';
                    visibleDatasets++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (visibleCount) visibleCount.textContent = visibleDatasets;
            if (noResults) noResults.style.display = visibleDatasets === 0 ? 'block' : 'none';
            if (table) table.style.display = visibleDatasets === 0 ? 'none' : '';
        }

        // Add event listeners for filters
        searchInput.addEventListener('input', filterDatasets);
        categoryFilter.addEventListener('change', filterDatasets);
        typeFilter.addEventListener('change', filterDatasets);

        // Sorting functionality
        var currentSort = { column: null, direction: 'asc' };

        var sortableHeaders = document.querySelectorAll('.datasets-table th.sortable');
        sortableHeaders.forEach(function (th) {
            th.addEventListener('click', function () {
                var column = this.dataset.sort;
                var direction = (currentSort.column === column && currentSort.direction === 'asc') ? 'desc' : 'asc';

                // Update sort icons
                var sortIcons = document.querySelectorAll('.datasets-table .sort-icon');
                sortIcons.forEach(function (icon) {
                    icon.textContent = '↕';
                });
                var thisIcon = this.querySelector('.sort-icon');
                if (thisIcon) {
                    thisIcon.textContent = direction === 'asc' ? '↑' : '↓';
                }

                // Sort rows
                rows.sort(function (a, b) {
                    var aVal = a.dataset[column] || '';
                    var bVal = b.dataset[column] || '';

                    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                    return 0;
                });

                // Re-append rows in sorted order
                rows.forEach(function (row) {
                    tbody.appendChild(row);
                });

                currentSort = { column: column, direction: direction };
            });
        });

        // Add hover effect for notes tooltip
        var notesIcons = document.querySelectorAll('.dataset-notes-icon');
        notesIcons.forEach(function (icon) {
            icon.style.cursor = 'pointer';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDatasets);
    } else {
        initDatasets();
    }
})();
