// src/levels/arrays02.js
// Arrays – Sum all elements in the array.

import { createGround, createArrayBlocks } from '../game/levelUtils.js';

export const meta = {
  id: 'arrays-02',
  title: 'Mảng - Tính tổng các phần tử',
  difficulty: 'easy',
  tags: ['arrays', 'sum', 'basics'],
  mode: 'code',
  description: 'Viết hàm trả về tổng của tất cả phần tử trong mảng.'
};

export function createLevel() {
  let ground = null;
  let blocks = [];

  // We'll visualize an example array in the world
  const sampleValues = [3, 5, 7, 10];

  return {
    id: meta.id,
    title: meta.title,

    build(engine, services) {
      const { cat, editor, hud } = services || {};

      // Basic ground + decorative array
      ground = createGround(engine.scene);
      blocks = createArrayBlocks(engine.scene, sampleValues, { z: 0, y: 0.5 });

      if (cat) {
        cat.position.set(blocks[0].mesh.position.x, 1, blocks[0].mesh.position.z - 5);
        cat.velocity.set(0, 0, 0);
        cat.mesh.position.copy(cat.position);
      }

      if (hud) {
        hud.setLevelTitle(meta.title);
      }

      if (editor) {
        editor.clearOutput();
        editor.printOutput(meta.title, 'system');
        editor.printOutput(meta.description);
        editor.printOutput(`Mảng ví dụ trong thế giới game: [${sampleValues.join(', ')}]`);
        editor.printOutput(
          'Nhiệm vụ: Viết hàm trả về tổng của tất cả phần tử.',
          'hint'
        );
        editor.printOutput(
          'Bạn có thể dùng JavaScript, Python hoặc C++ (đổi ở góc trên bên phải bảng code).',
          'dim'
        );

        // Mẫu code cho từng ngôn ngữ
        const templates = {
          js:
`// Hãy viết hàm này để nó trả về
// tổng của tất cả phần tử trong mảng.
function sumArray(arr) {
  // TODO
}

// Bạn có thể tự thử:
console.log(sumArray([1, 2, 3])); // 6`,
          python:
`# Hãy viết hàm này để nó trả về
# tổng của tất cả phần tử trong mảng.
def sum_array(arr):
  # TODO
  pass
`,
          cpp:
`// Hãy viết hàm này để nó trả về
// tổng của n phần tử đầu tiên trong mảng arr.
// (Không cần viết hàm main, game sẽ tự chạy các bài kiểm tra.)
int sumArray(int arr[], int n) {
  // TODO
  return 0;
}
`,
        };
        editor.setTemplates(templates);
        editor.setLanguage('js');
        editor.setCode(templates.js);
      }
    },

    destroy(engine) {
      if (ground) {
        engine.scene.remove(ground);
        ground = null;
      }
      if (blocks && blocks.length) {
        for (const b of blocks) {
          engine.scene.remove(b.mesh);
        }
        blocks = [];
      }
    },

    async runUserCode({ code, lang, editor, ensurePyodide, runCpp }) {
      const tests = [
        { input: [], expected: 0 },
        { input: [1], expected: 1 },
        { input: [1, 2, 3], expected: 6 },
        { input: [3, 5, 7, 10], expected: 25 },
        { input: [-1, 1, -2, 2], expected: 0 },
      ];

      editor.printOutput('Đang chạy các bài kiểm tra cho hàm tính tổng...', 'dim');

      try {
        if (lang === 'cpp') {
          // Ghép code của bạn với hàm main tự sinh để chạy các bài kiểm tra
          const harness = tests
            .map((t) => {
              const n = t.input.length;
              // JSCPP lỗi với mảng 1 phần tử có giá trị khác 0, nên thêm 1 phần tử đệm
              const init = [...t.input, 0].join(', ');
              return `  { int a[${n + 1}] = {${init}}; cout << sumArray(a, ${n}) << endl; }`;
            })
            .join('\n');
          const full =
            '#include <iostream>\nusing namespace std;\n' +
            code +
            `\nint main() {\n${harness}\n  return 0;\n}\n`;
          const { out } = runCpp(full);
          const lines = out.trim().split('\n');
          for (let i = 0; i < tests.length; i++) {
            const t = tests[i];
            if (String(lines[i]).trim() !== String(t.expected)) {
              editor.printOutput(
                `Sai rồi: sumArray({${t.input.join(', ')}}, ${t.input.length}) ` +
                  `cần ra ${t.expected}, nhưng nhận được ${lines[i] === undefined ? '(không có kết quả)' : lines[i]}`,
                'error'
              );
              return;
            }
          }
          editor.printOutput('Đúng hết! Hàm sumArray (C++) vượt qua mọi bài kiểm tra!', 'success');
          return;
        }

        if (lang === 'python') {
          const pyodide = await ensurePyodide();

          await pyodide.runPythonAsync(code + '\n');

          for (const t of tests) {
            const pyArr = JSON.stringify(t.input);
            const result = await pyodide.runPythonAsync(
              `sum_array(${pyArr})`
            );
            if (result !== t.expected) {
              editor.printOutput(
                `Sai rồi: sum_array(${JSON.stringify(t.input)}) ` +
                `cần ra ${t.expected}, nhưng nhận được ${result}`,
                'error'
              );
              return;
            }
          }

          editor.printOutput('Đúng hết! Hàm sum_array (Python) vượt qua mọi bài kiểm tra!', 'success');
          return;
        } else {
          const wrapped = new Function(
            code + '\nreturn (typeof sumArray === "function" ? sumArray : null);'
          );
          const fn = wrapped();
          if (!fn) {
            editor.printOutput('Chưa có hàm sumArray(arr).', 'error');
            return;
          }

          for (const t of tests) {
            const result = fn(t.input.slice());
            if (result !== t.expected) {
              editor.printOutput(
                `Sai rồi: sumArray(${JSON.stringify(t.input)}) ` +
                `cần ra ${t.expected}, nhưng nhận được ${result}`,
                'error'
              );
              return;
            }
          }

          editor.printOutput('Đúng hết! Hàm sumArray (JavaScript) vượt qua mọi bài kiểm tra!', 'success');
        }
      } catch (err) {
        editor.printOutput(String(err), 'error');
      }
    },

    hint(editor) {
      if (!editor) return;
      editor.printOutput(
        'Gợi ý: Tạo một biến bằng 0, rồi duyệt qua mảng và cộng từng phần tử vào biến đó.',
        'hint'
      );
      editor.printOutput(
        'JS: let s = 0; for (const x of arr) s += x;',
        'dim'
      );
      editor.printOutput(
        'Python: s = 0; for x in arr: s += x',
        'dim'
      );
      editor.printOutput(
        'C++: int s = 0; for (int i = 0; i < n; i++) s += arr[i]; return s;',
        'dim'
      );
    },

    explain(editor) {
      if (!editor) return;
      editor.printOutput(
        'Giải thích: Tổng là kết quả cộng tất cả các phần tử lại.\n' +
        'Hãy duyệt qua mảng, cộng dồn vào một biến tổng rồi trả về biến đó.\n' +
        'Trường hợp đặc biệt: mảng rỗng thì tổng bằng 0.',
        'system'
      );
    }
  };
}
