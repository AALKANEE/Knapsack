class KnapsackSolver {
    constructor() {
        // هنگام ایجاد یک شیء از این کلاس، این متد اجرا می‌شود و رویدادها را تنظیم می‌کند
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // تنظیم رویداد تغییر برای ورودی تعداد آیتم‌ها
        document.getElementById('numItems').addEventListener('change', () => this.updateItemInputs());
        // تنظیم رویداد کلیک برای دکمه حل مسئله کوله‌پشتی
        document.getElementById('solveButton').addEventListener('click', () => this.solveKnapsack());
    }

    updateItemInputs() {
        // دریافت تعداد آیتم‌ها از ورودی
        const numItems = parseInt(document.getElementById('numItems').value);
        const itemsInputs = document.getElementById('itemsInputs');
        // پاک کردن ورودی‌های قبلی آیتم‌ها
        itemsInputs.innerHTML = '';
        // ایجاد ورودی‌های جدید بر اساس تعداد آیتم‌ها
        for (let i = 0; i < numItems; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('input-group');
            itemDiv.innerHTML = `
                <label>Value of item ${i + 1}:</label>
                <input type="number" class="item-value" min="1">
                <label>Weight of item ${i + 1}:</label>
                <input type="number" class="item-weight" min="1">
            `;
            itemsInputs.appendChild(itemDiv);
        }
    }

    // الگوریتم حریصانه برای حل مسئله کوله‌پشتی
    knapsackGreedy(values, weights, capacity) {
        // ایجاد آرایه‌ای از آیتم‌ها با نسبت ارزش به وزن
        let items = values.map((value, index) => ({
            value,
            weight: weights[index],
            ratio: value / weights[index]
        }));

        // مرتب‌سازی آیتم‌ها بر اساس نسبت ارزش به وزن به صورت نزولی
        items.sort((a, b) => b.ratio - a.ratio);

        let totalValue = 0;
        let totalWeight = 0;
        let includedItems = [];

        // انتخاب آیتم‌ها تا زمانی که وزن کل از ظرفیت تجاوز نکند
        for (let item of items) {
            if (totalWeight + item.weight <= capacity) {
                includedItems.push(item);
                totalValue += item.value;
                totalWeight += item.weight;
            }
        }

        return {
            totalValue,
            totalWeight,
            includedItems
        };
    }

    solveKnapsack() {
        // دریافت مقادیر و وزن‌ها از ورودی‌های کاربر
        const values = Array.from(document.getElementsByClassName('item-value')).map(input => parseInt(input.value));
        const weights = Array.from(document.getElementsByClassName('item-weight')).map(input => parseInt(input.value));
        const capacity = parseInt(document.getElementById('capacity').value);

        // حل مسئله کوله‌پشتی با استفاده از الگوریتم حریصانه
        const result = this.knapsackGreedy(values, weights, capacity);

        // نمایش نتایج در صفحه
        document.getElementById('totalValue').innerText = `Total Value: ${result.totalValue}`;
        document.getElementById('totalWeight').innerText = `Total Weight: ${result.totalWeight}`;
        const includedItemsList = document.getElementById('includedItems');
        includedItemsList.innerHTML = '';
        result.includedItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerText = `Item ${index + 1} - Value: ${item.value}, Weight: ${item.weight}`;
            includedItemsList.appendChild(li);
        });

        // نمایش بخش نتیجه‌ها
        document.querySelector('.result-section').style.display = 'block';
    }
}

// هنگام بارگذاری کامل صفحه، یک شیء از کلاس KnapsackSolver ایجاد می‌شود
document.addEventListener('DOMContentLoaded', () => {
    new KnapsackSolver();
});
