/**
 * Bookshelf Interactive Table JavaScript
 * Handles filtering, sorting, and statistics for the books table
 */

(function () {
    'use strict';

    function initBookshelf() {
        var table = document.getElementById('bookshelf-table');
        var tbody = document.getElementById('books-tbody');

        if (!table || !tbody) {
            return;
        }

        var rows = Array.prototype.slice.call(tbody.querySelectorAll('.book-row'));
        var searchInput = document.getElementById('book-search');
        var categoryFilter = document.getElementById('category-filter');
        var yearFilter = document.getElementById('year-filter');
        var ratingFilter = document.getElementById('rating-filter');
        var noResults = document.getElementById('no-results');
        var visibleCount = document.getElementById('visible-count');

        if (!searchInput || !categoryFilter || !yearFilter || !ratingFilter) {
            return;
        }

        // Collect unique categories and years
        var categoriesSet = {};
        var yearsSet = {};

        rows.forEach(function (r) {
            if (r.dataset.category) {
                categoriesSet[r.dataset.category] = true;
            }
            if (r.dataset.year) {
                yearsSet[r.dataset.year] = true;
            }
        });

        var categories = Object.keys(categoriesSet).sort();
        var years = Object.keys(yearsSet).sort().reverse();

        // Populate category filter
        categories.forEach(function (cat) {
            var option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        // Populate year filter
        years.forEach(function (year) {
            var option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });

        // Calculate and display statistics
        function updateStats() {
            var totalBooks = rows.length;
            if (totalBooks === 0) return;

            var sum = 0;
            rows.forEach(function (r) {
                sum += parseInt(r.dataset.rating, 10) || 0;
            });
            var avgRating = (sum / totalBooks).toFixed(1);
            var totalCategories = categories.length;
            var currentYear = new Date().getFullYear();
            var currentYearBooks = rows.filter(function (r) {
                return parseInt(r.dataset.year, 10) === currentYear;
            }).length;

            var avgRatingEl = document.getElementById('avg-rating');
            var totalCategoriesEl = document.getElementById('total-categories');
            var currentYearBooksEl = document.getElementById('current-year-books');

            if (avgRatingEl) avgRatingEl.textContent = avgRating;
            if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
            if (currentYearBooksEl) currentYearBooksEl.textContent = currentYearBooks;
        }
        updateStats();

        // Filter function
        function filterBooks() {
            var searchTerm = searchInput.value.toLowerCase();
            var categoryValue = categoryFilter.value;
            var yearValue = yearFilter.value;
            var ratingValue = ratingFilter.value;

            var visibleBooks = 0;

            rows.forEach(function (row) {
                var title = row.dataset.title || '';
                var author = row.dataset.author || '';
                var category = row.dataset.category || '';
                var year = row.dataset.year || '';
                var rating = parseInt(row.dataset.rating, 10) || 0;

                var matchesSearch = !searchTerm ||
                    title.indexOf(searchTerm) !== -1 ||
                    author.indexOf(searchTerm) !== -1;
                var matchesCategory = !categoryValue || category === categoryValue;
                var matchesYear = !yearValue || year === yearValue;
                var matchesRating = !ratingValue || rating >= parseInt(ratingValue, 10);

                if (matchesSearch && matchesCategory && matchesYear && matchesRating) {
                    row.style.display = '';
                    visibleBooks++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (visibleCount) visibleCount.textContent = visibleBooks;
            if (noResults) noResults.style.display = visibleBooks === 0 ? 'block' : 'none';
            if (table) table.style.display = visibleBooks === 0 ? 'none' : '';
        }

        // Add event listeners for filters
        searchInput.addEventListener('input', filterBooks);
        categoryFilter.addEventListener('change', filterBooks);
        yearFilter.addEventListener('change', filterBooks);
        ratingFilter.addEventListener('change', filterBooks);

        // Sorting functionality
        var currentSort = { column: null, direction: 'asc' };

        var sortableHeaders = document.querySelectorAll('th.sortable');
        sortableHeaders.forEach(function (th) {
            th.addEventListener('click', function () {
                var column = this.dataset.sort;
                var direction = (currentSort.column === column && currentSort.direction === 'asc') ? 'desc' : 'asc';

                // Update sort icons
                var sortIcons = document.querySelectorAll('.sort-icon');
                sortIcons.forEach(function (icon) {
                    icon.textContent = '↕';
                });
                var thisIcon = this.querySelector('.sort-icon');
                if (thisIcon) {
                    thisIcon.textContent = direction === 'asc' ? '↑' : '↓';
                }

                // Sort rows
                rows.sort(function (a, b) {
                    var aVal, bVal;

                    if (column === 'rating' || column === 'year_read') {
                        var dataKey = column === 'year_read' ? 'year' : column;
                        aVal = parseInt(a.dataset[dataKey], 10) || 0;
                        bVal = parseInt(b.dataset[dataKey], 10) || 0;
                    } else {
                        aVal = a.dataset[column] || '';
                        bVal = b.dataset[column] || '';
                    }

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
        var notesIcons = document.querySelectorAll('.book-notes-icon');
        notesIcons.forEach(function (icon) {
            icon.style.cursor = 'pointer';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBookshelf);
    } else {
        initBookshelf();
    }
})();
