/* global Pyanxchet */

function 觸發反切() {
  const 反切 = document.getElementById('反切輸入').value;
  if ([...反切].length !== 2) return; // 若長度不為 2，略過
  if (/[0-9a-zA-Z]/g.test(反切)) return; // 若含有英文字母或數字，略過
  const [上字, 下字] = [...反切];

  try {
    提供多音字選擇(上字, document.getElementById('上字讀音'));
    提供多音字選擇(下字, document.getElementById('下字讀音'));
  } catch (e) {
    document.getElementById('結果').value = e.message; // 無某字讀音
    return;
  }

  處理多音字選擇();
}

function 提供多音字選擇(漢字, 目標標籤) {
  目標標籤.innerHTML = '';

  const items = Pyanxchet.Qieyun.query字頭(漢字);
  const fragment = document.createDocumentFragment();

  for (const { 音韻地位 } of items) {
    const option = document.createElement('option');
    option.value = 音韻地位.編碼;
    option.innerText = 音韻地位.描述;
    fragment.appendChild(option);
  }

  if (items.length === 0) {
    throw Error(`無${漢字}字讀音`);
  }

  目標標籤.disabled = items.length === 1; // 若長度為 1，則無需選擇
  目標標籤.appendChild(fragment);
}

function 處理多音字選擇() {
  const 反切 = document.getElementById('反切輸入').value;
  if ([...反切].length !== 2) return; // 若長度不為 2，略過
  if (/[0-9a-zA-Z]/g.test(反切)) return; // 若含有英文字母或數字，略過
  const [上字, 下字] = [...反切];

  const 上字編碼 = document.getElementById('上字讀音').value;
  const 下字編碼 = document.getElementById('下字讀音').value;

  const 上字音韻地位 = Pyanxchet.Qieyun.音韻地位.from編碼(上字編碼);
  const 下字音韻地位 = Pyanxchet.Qieyun.音韻地位.from編碼(下字編碼);

  const fragment = document.createDocumentFragment();

  let p = document.createElement('p');
  const b = document.createElement('b');
  b.innerText = `${上字}${下字}切`;
  p.appendChild(b);
  fragment.appendChild(p);

  p = document.createElement('p');
  p.appendChild(document.createTextNode(`${上字}：${上字音韻地位.描述}${Pyanxchet.生成擬音(上字音韻地位)}`));
  p.appendChild(document.createElement('br'));
  p.appendChild(document.createTextNode(`${下字}：${下字音韻地位.描述}${Pyanxchet.生成擬音(下字音韻地位)}`));
  fragment.appendChild(p);

  const { 反切過程 } = Pyanxchet.pyanxchet(上字音韻地位, 下字音韻地位);

  const ul = document.createElement('ul');
  for (const line of 反切過程) {
    const li = document.createElement('li');
    li.innerText = line;
    ul.appendChild(li);
  }
  fragment.appendChild(ul);

  const 結果 = document.getElementById('結果');
  結果.innerHTML = '';
  結果.appendChild(fragment);
}
