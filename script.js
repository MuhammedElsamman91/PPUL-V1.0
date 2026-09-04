const workoutPlans = {
  push: {
    title: "اليوم الأول: دفع Push",
    exercises: [
      ["بنش برس بالبار", "Flat Barbell Bench Press", 3, "6 - 8"],
      ["تجميع دمبل على بنش مائل", "Incline Dumbbell Press", 3, "8 - 10"],
      ["ضغط أكتاف بالدمبل جالسًا", "Seated Dumbbell Shoulder Press", 3, "8 - 10"],
      ["رفرفة جانبي", "Lateral Raises", 4, "12 - 15"],
      ["ترايسبس كابل دفع لأسفل", "Triceps Cable Pushdown", 3, "10 - 12"]
    ]
  },

  pull: {
    title: "اليوم الثاني: سحب Pull",
    exercises: [
      ["سحب عالي للظهر أو عقلة", "Lat Pulldown / Pull Ups", 3, "8 - 10"],
      ["سحب أرضي بالكابل أو البار", "Chest Supported Row / Cable Row", 3, "8 - 10"],
      ["سحب للوجه بالكابل", "Face Pulls", 4, "12 - 15"],
      ["تبادل بايسبس بالدمبل", "Incline Dumbbell Curls", 3, "10 - 12"],
      ["بايسبس هامر", "Hammer Curls", 3, "10 - 12"]
    ]
  },

  legs: {
    title: "اليوم الثالث: أرجل Legs",
    exercises: [
      ["سكوات بالبار", "Barbell Back Squat", 3, "6 - 8"],
      ["دفع أرجل بالماكينة", "Leg Press", 3, "10 - 12"],
      ["أمامية أرجل بالماكينة", "Leg Extensions", 3, "12 - 15"],
      ["خلفية أرجل بالماكينة", "Lying Leg Curls", 4, "10 - 12"],
      ["سمانة واقفًا", "Standing Calf Raises", 4, "12 - 15"]
    ]
  },

  upper: {
    title: "اليوم الخامس: الجزء العلوي Upper",
    exercises: [
      ["تجميع صدر بالدمبل على بنش مائل", "Incline Dumbbell Press", 3, "8 - 10"],
      ["سحب ظهر بالبار أو الكابل", "Barbell / Cable Row", 3, "8 - 10"],
      ["تجميع صدر فراشة", "Chest Flyes", 2, "12 - 15"],
      ["رفرفة جانبي للأكتاف", "Lateral Raises", 4, "12 - 15"],
      ["بايسبس بار + ترايسبس فوق الرأس", "Superset", 3, "10 - 12"]
    ]
  },

  lower: {
    title: "اليوم السادس: الجزء السفلي Lower",
    exercises: [
      ["الرفعة الميتة الروماني", "Romanian Deadlift", 3, "8 - 10"],
      ["طعان بالدمبل لكل رجل", "Dumbbell Lunges", 3, "10 لكل رجل"],
      ["خلفية أرجل بالماكينة", "Leg Curls", 3, "12 - 15"],
      ["سمانة جالسًا", "Seated Calf Raises", 4, "12 - 15"],
      ["تمرين بطن", "Cable Crunches / Leg Raises", 3, "15"]
    ]
  }
};

const dateInput = document.getElementById("date");
const dayInput = document.getElementById("day");
const workoutTitle = document.getElementById("workoutTitle");
const workoutContent = document.getElementById("workoutContent");
const message = document.getElementById("message");

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

dateInput.value = getTodayDate();

function showWorkout() {
  const selectedDay = dayInput.value;

  if (selectedDay === "rest1" || selectedDay === "rest2") {
    workoutTitle.textContent = "يوم راحة";

    workoutContent.innerHTML = `
      <div class="rest-day">
        لا يوجد تمرين اليوم، خذ وقتك في الراحة والاستشفاء.
      </div>
    `;

    return;
  }

  const workout = workoutPlans[selectedDay];

  workoutTitle.textContent = workout.title;

  let html = "";

  workout.exercises.forEach((exercise, exerciseIndex) => {
    let setsHtml = "";

    for (let setNumber = 1; setNumber <= exercise[2]; setNumber++) {
      setsHtml += `
        <div class="set-row">
          <strong>المجموعة ${setNumber}</strong>

          <input
            type="number"
            class="weight-input"
            data-exercise="${exerciseIndex}"
            data-set="${setNumber}"
            placeholder="الوزن بالكيلو"
            min="0"
            step="0.5"
          >

          <input
            type="number"
            class="reps-input"
            data-exercise="${exerciseIndex}"
            data-set="${setNumber}"
            placeholder="عدد العدات"
            min="0"
          >
        </div>
      `;
    }

    html += `
      <div class="exercise-card">
        <div class="exercise-header">
          <div>
            <strong>${exercise[0]}</strong>
            <small>${exercise[1]}</small>
          </div>

          <div class="target">
            المطلوب: ${exercise[2]} مجموعات × ${exercise[3]} عدات
          </div>
        </div>

        <div class="sets-header">
          <span>المجموعة</span>
          <span>الوزن</span>
          <span>عداتك</span>
        </div>

        ${setsHtml}
      </div>
    `;
  });

  workoutContent.innerHTML = html;

  loadWorkout();
}

function getStorageKey() {
  return `pplul-${dateInput.value}-${dayInput.value}`;
}

function saveWorkout() {
  const weightInputs = document.querySelectorAll(".weight-input");
  const repsInputs = document.querySelectorAll(".reps-input");

  const sets = [];

  weightInputs.forEach((input, index) => {
    sets.push({
      weight: input.value,
      reps: repsInputs[index].value,
      exercise: input.dataset.exercise,
      set: input.dataset.set
    });
  });

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(sets)
  );

  showMessage("تم حفظ التمرين بنجاح");
}

function loadWorkout() {
  const savedWorkout = localStorage.getItem(getStorageKey());

  if (!savedWorkout) return;

  const sets = JSON.parse(savedWorkout);

  const weightInputs = document.querySelectorAll(".weight-input");
  const repsInputs = document.querySelectorAll(".reps-input");

  sets.forEach((set, index) => {
    if (weightInputs[index]) {
      weightInputs[index].value = set.weight;
    }

    if (repsInputs[index]) {
      repsInputs[index].value = set.reps;
    }
  });
}

function clearInputs() {
  document.querySelectorAll(".weight-input").forEach(input => {
    input.value = "";
  });

  document.querySelectorAll(".reps-input").forEach(input => {
    input.value = "";
  });

  localStorage.removeItem(getStorageKey());
}

function createMessage() {
  const selectedDay = dayInput.value;

  if (selectedDay === "rest1" || selectedDay === "rest2") {
    return `يوم راحة\nالتاريخ: ${dateInput.value}`;
  }

  const workout = workoutPlans[selectedDay];
  const weightInputs = document.querySelectorAll(".weight-input");
  const repsInputs = document.querySelectorAll(".reps-input");

  let text = `${workout.title}\n`;
  text += `التاريخ: ${dateInput.value}\n\n`;

  let inputIndex = 0;

  workout.exercises.forEach(exercise => {
    text += `${exercise[0]}\n`;
    text += `المطلوب: ${exercise[2]} مجموعات × ${exercise[3]} عدات\n`;

    for (let set = 1; set <= exercise[2]; set++) {
      const weight = weightInputs[inputIndex].value || "غير مسجل";
      const reps = repsInputs[inputIndex].value || "غير مسجل";

      text += `المجموعة ${set}: ${weight} كجم - ${reps} عدة\n`;

      inputIndex++;
    }

    text += "\n";
  });

  return text;
}

function sendEmail() {
  const subject = "سجل تمارين PPLUL";
  const body = createMessage();

  window.location.href =
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function sendTelegram() {
  const text = createMessage();

  const telegramUrl =
    `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;

  window.open(telegramUrl, "_blank");
}

function showMessage(text) {
  message.textContent = text;
  message.style.display = "block";

  setTimeout(() => {
    message.style.display = "none";
  }, 2500);
}

dayInput.addEventListener("change", showWorkout);
dateInput.addEventListener("change", showWorkout);

document.getElementById("saveBtn").addEventListener("click", saveWorkout);
document.getElementById("emailBtn").addEventListener("click", sendEmail);
document.getElementById("telegramBtn").addEventListener("click", sendTelegram);
document.getElementById("clearBtn").addEventListener("click", clearInputs);

showWorkout();
