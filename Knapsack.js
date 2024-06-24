class KnapsackSolver {
  constructor() {
    // تنظیم رویدادها هنگام ایجاد یک شیء از این کلاس
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // رویداد تغییر برای ورودی تعداد آیتم‌ها
    document
      .getElementById("numItems")
      .addEventListener("change", () => this.updateItemInputs());
    // رویداد کلیک برای دکمه حل مسئله
    document
      .getElementById("solveButton")
      .addEventListener("click", () => this.solveKnapsack());
  }

  updateItemInputs() {
    // دریافت تعداد آیتم‌ها از ورودی
    const numItems = parseInt(document.getElementById("numItems").value);
    const itemsInputs = document.getElementById("itemsInputs");
    // پاک کردن ورودی‌های قبلی آیتم‌ها
    itemsInputs.innerHTML = "";
    // ایجاد ورودی‌های جدید بر اساس تعداد آیتم‌ها
    for (let i = 0; i < numItems; i++) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("input-group");
      itemDiv.innerHTML = `
              <label>Value of item ${i + 1}:</label>
              <input type="number" class="item-value" min="1">
              <label>Weight of item ${i + 1}:</label>
              <input type="number" class="item-weight" min="1">
          `;
      itemsInputs.appendChild(itemDiv);
    }
  }

  // الگوریتم Backtracking برای حل مسئله کوله‌پشتی 0/1
  knapsackBacktrack(values, weights, capacity) {
    const n = values.length; // تعداد آیتم‌ها
    let maxValue = 0; // حداکثر مقدار
    let bestCombination = []; // بهترین ترکیب آیتم‌ها

    // تابع بازگشتی برای Backtracking
    const backtrack = (index, currentWeight, currentValue, combination) => {
      // بررسی به‌روزرسانی حداکثر مقدار و ترکیب آیتم‌ها
      if (currentWeight <= capacity && currentValue > maxValue) {
        maxValue = currentValue;
        bestCombination = combination.slice(); // ذخیره ترکیب فعلی
      }
      // شرایط پایان بازگشت: رسیدن به انتهای لیست آیتم‌ها یا وزن بیشتر از ظرفیت
      if (index === n || currentWeight > capacity) {
        return;
      }
      // شامل کردن آیتم فعلی
      combination.push(index);
      backtrack(
        index + 1,
        currentWeight + weights[index],
        currentValue + values[index],
        combination
      );
      // خارج کردن آیتم فعلی
      combination.pop();
      backtrack(index + 1, currentWeight, currentValue, combination);
    };

    backtrack(0, 0, 0, []); // شروع بازگشت
    return { maxValue, bestCombination }; // بازگرداندن حداکثر مقدار و بهترین ترکیب
  }

  solveKnapsack() {
    // دریافت مقادیر و وزن‌های آیتم‌ها از ورودی‌ها
    const values = Array.from(
      document.getElementsByClassName("item-value")
    ).map((input) => parseInt(input.value));
    const weights = Array.from(
      document.getElementsByClassName("item-weight")
    ).map((input) => parseInt(input.value));
    const capacity = parseInt(document.getElementById("capacity").value);

    // حل مسئله کوله‌پشتی با استفاده از الگوریتم Backtracking
    const result = this.knapsackBacktrack(values, weights, capacity);

    // نمایش نتایج در صفحه
    document.getElementById(
      "totalValue"
    ).innerText = `Total Value: ${result.maxValue}`;
    const includedItemsList = document.getElementById("includedItems");
    includedItemsList.innerHTML = "";
    let totalWeight = 0;
    result.bestCombination.forEach((itemIndex) => {
      const li = document.createElement("li");
      li.innerText = `Item ${itemIndex + 1} - Value: ${
        values[itemIndex]
      }, Weight: ${weights[itemIndex]}`;
      includedItemsList.appendChild(li);
      totalWeight += weights[itemIndex];
    });
    document.getElementById(
      "totalWeight"
    ).innerText = `Total Weight: ${totalWeight}`;

    document.querySelector(".result-section").style.display = "block";

    // نمایش گرافیکی کوله‌پشتی
    this.drawKnapsack(result.bestCombination, values, weights);
  }

  drawKnapsack(bestCombination, values, weights) {
    const canvas = document.getElementById("knapsackCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // پاک کردن بوم

    const barWidth = 40; // عرض هر ستون
    const spacing = 10; // فاصله بین ستون‌ها
    let x = spacing;

    // رسم ستون‌ها برای آیتم‌های شامل شده در ترکیب بهترین
    bestCombination.forEach((index) => {
      const height = values[index] * 3; // ارتفاع ستون بر اساس مقدار آیتم
      ctx.fillStyle = "orange";
      ctx.fillRect(x, canvas.height - height, barWidth, height); // رسم ستون
      ctx.fillStyle = "black";
      ctx.fillText(`Item ${index + 1}`, x, canvas.height - height - 10); // نمایش شماره آیتم
      x += barWidth + spacing;
    });
  }
}

// هنگام بارگذاری کامل صفحه، یک شیء از کلاس KnapsackSolver ایجاد می‌شود
document.addEventListener("DOMContentLoaded", () => {
  new KnapsackSolver();
});
