import "../style.css";
import { getDisplay } from "./function";

function main() {
  const operators = ["+", "-", "×", "÷"];

  // 最初の数字を保存する
  let firstValue = "";

  // 押された演算子を保存する
  let operator = "";

  // ２個目の数字を入力中かどうか
  let waitingForSecondValue = false;

  // フラグを追加
  let isCleared = false;

  // ボタンを取得
  const inputButtons = document.querySelectorAll(
    ".input-btn, .operator-btn, .submit-btn",
  ) as NodeListOf<HTMLButtonElement>;

  // 入力ボタンを押したときの処理
  inputButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 入力ボタンの data-value 属性を取得する
      const inputValue = button.dataset.value;

      // 現在の display の値を取得する
      const display = document.getElementById("display-value");
      const history = document.getElementById("history-value");
      const displayValue = display!.textContent ?? "";

      if (!inputValue) return;

      // 履歴エリア
      function updateHistory() {
        const currentValue = display!.textContent ?? "";

        if (firstValue === "" && operator === "") {
          history!.textContent = currentValue;
          return;
        }

        if (waitingForSecondValue) {
          history!.textContent = `${firstValue} ${operator}`;
          return;
        }
        history!.textContent = `${firstValue} ${operator} ${currentValue}`;
      }

      // C を押すとディスプレイが空になる
      if (inputValue === "C") {
        display!.textContent = "";
        history!.textContent = "";

        firstValue = "";
        operator = "";
        waitingForSecondValue = false;

        isCleared = true;
        return;
      }

      // クリア後に「.」と演算子を無視する
      if (isCleared && (inputValue === "." || operators.includes(inputValue))) {
        return;
      }

      // 演算子入力
      if (operators.includes(inputValue!)) {
        // マイナス記号
        if (inputValue === "-" && displayValue === "") {
          display!.textContent = "-";
          return;
        }

        // 今画面に表示されてる数字を保存
        firstValue = displayValue!;
        // 演算子入力を保存（演算子も上書きされる）
        operator = inputValue!;
        // ２つ目の数字入力
        waitingForSecondValue = true;

        // 演算子を押したときに表示
        updateHistory();

        return;
      }

      // =の処理
      if (inputValue === "=") {
        // 演算子の後に「=」を押すとエラーになる
        if (waitingForSecondValue) {
          display!.textContent = "エラー";
          return;
        }
        const secondValue = displayValue!;

        let result = 0;

        if (operator === "+") {
          result = Number(firstValue) + Number(secondValue);
        }

        if (operator === "-") {
          result = Number(firstValue) - Number(secondValue);
        }

        if (operator === "×") {
          result = Number(firstValue) * Number(secondValue);
        }

        if (operator === "÷") {
          if (Number(secondValue) === 0) {
            display!.textContent = "エラー";
            return;
          }
          result = Number(firstValue) / Number(secondValue);
        }

        history!.textContent = `${firstValue} ${operator} ${secondValue} = ${result}`;

        // 指数表記
        const resultText = String(result);

        if (resultText.replace(".", "").length > 8) {
          display!.textContent = result.toExponential(7);
        } else {
          display!.textContent = resultText;
        }
        return;
      }

      // 未入力及び既に小数点が入力されている状態で . を入力しても何もしない
      if (
        inputValue === "." &&
        (displayValue === "" || displayValue?.includes("."))
      ) {
        return;
      }

      // ２個目の数字入力開始
      if (waitingForSecondValue) {
        display!.textContent = inputValue!;
        waitingForSecondValue = false;

        isCleared = false;

        // ２個目の数字を押したときに表示
        updateHistory();

        return;
      }

      isCleared = false;

      const newDisplayValue = getDisplay(inputValue!, displayValue);

      display!.textContent = newDisplayValue;

      updateHistory();
    });
  });
}

main();
