let groupData = [
  {
    groupCode: "DWSD00001",
    process: [
      { id: 1, name:"DWA050"},
      { id: 2, name:"DWB050"},
      { id: 3, name:"DWC050"},
             ],
    items: [
      { id: 1, name: "手感", type: "文字", unit: "手感", max: 0, mid: 0, min: 0, manual: false},
      { id: 2, name: "外觀", type: "文字", unit: "外觀", max: 0, mid: 0, min: 0, manual: false},
      { id: 3, name: "OF", type: "數值", unit: "gf", max: 0, mid: 125, min: 0, manual: false},
    ],
    materials: [
      { id: 1, name:"100014099"},
      { id: 2, name:"100014343"},
      { id: 3, name:"100014483"},
 ]
  }
];

let currentGroupIndex = 0;
  let machineData = [];
// 顯示控制
function showPage(page){
  document.querySelectorAll(".page").forEach(p=> p.style.display="none");
  document.getElementById("page-"+page).style.display="block";
  if(page==="main") renderMain();
  if(page==="process") renderProcess();
  if(page==="item") renderItem();
  if(page==="material") renderMaterial();
   if(page==='machine') renderMachine();
}
function backToMain(){ showPage("main"); }



















// 主畫面渲染（多群組 + 子表格 + 刪除群組）
function renderMain(){
  let tbody=document.getElementById("main-table-body");
  tbody.innerHTML="";
  groupData.forEach((group,index)=>{
 
    
    let itemHTML=`
    <table class="sub-table" style="display:none"><thead><tr>
      <th style="font-size: 10px";>項目</th>
      <th style="font-size: 10px";>格式</th>
      <th style="font-size: 10px";>單位</th>
      <th style="font-size: 10px";>上限</th>
      <th style="font-size: 10px";>中間</th>
      <th style="font-size: 10px";>下限</th>
      <th style="font-size: 10px";>手動</th>
    </tr></thead><tbody>`;
    group.items.forEach(item=>{
      itemHTML+=`<tr>
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td>${item.unit}</td>
        <td>${item.max}</td>
        <td>${item.mid}</td>
        <td>${item.min}</td>
        <td>${item.manual?"✔":""}</td>
      </tr>`;
    });
    itemHTML+="</tbody></table>";

   // 主頁面:料號  
   let matHTML = `<div class="sub-table-container"><div class="sub-table-grid">`;
group.materials.forEach(m => {
  matHTML += `<div>${m.name}</div>`;
});
matHTML += `</div></div>`;
   
    


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
 // 主頁面:製程代碼  
  let processHTML = `<div class="sub-table-container"><div class="sub-table-grid">`;
group.process.forEach(p => {
  processHTML += `<div>${p.name}</div>`;
});
processHTML += `</div></div>`;
    
    
    
    tbody.innerHTML+=`<tr>
      <td>${group.groupCode}</td>
      <td>${processHTML}</td>
      <td>${itemHTML}</td>
      <td>${matHTML}</td>
     <td>
  <input type="checkbox" data-hide="1" onchange="toggleSubTable(this)">顯示
<div class="lux-select-wrapper">
  <select class="lux-select" id="action-${index}">
    <option value="">請選擇</option>
    <option value="process">製程</option>
    <option value="item">項目參數</option>
    <option value="material">料號</option>
    <option value="delete">刪除群組</option>
  </select>
</div>

<button class="lux-btn" onclick="runAction(${index})">🔍</button>



</td>
    </tr>`;
  });
}
function runAction(index) {
    let action = document.getElementById(`action-${index}`).value;

    if (!action) {
        alert("請先選擇功能");
        return;
    }

    switch(action) {
        case "process":
            openProcess(index);
            break;
        case "item":
            openItem(index);
            break;
        case "material":
            openMaterial(index);
            break;
        case "delete":
            deleteGroup(index);
            break;
    }
}



function toggleSubTable(cb){
  let tr = cb.closest("tr");
  let subTables = tr.querySelectorAll(".sub-table");
  subTables.forEach(t => t.style.display = cb.checked ? "table" : "none");
}

// 新增/刪除群組
function showAddGroupModal() {
  document.getElementById("addGroupModal").style.display = "block";
}

// 關閉彈窗
function closeAddGroupModal() {
  document.getElementById("addGroupModal").style.display = "none";
}

// 確認新增群組
function confirmAddGroup() {
  let machine = document.getElementById("modalMachine").value.trim().toUpperCase();
  let count = parseInt(document.getElementById("modalCount").value);
  let copyCode = document.getElementById("modalCopyCode").value.trim().toUpperCase();

  if (!machine) { alert("請輸入機種代碼"); return; }
  if (isNaN(count) || count < 1) { alert("新增數量至少為 1"); return; }

  // 找要複製的群組
  let copyData = null;
  if (copyCode) {
    copyData = groupData.find(g => g.groupCode.toUpperCase() === copyCode);
    if (copyData) copyData = JSON.parse(JSON.stringify(copyData));
    else alert("找不到該群組，將新增空群組");
  }

  for (let i = 0; i < count; i++) {
    // 計算 SD 後序號
    let machineGroups = groupData.filter(g => g.groupCode.startsWith(machine + "SD"));
    let nextSeq = 1;
    if (machineGroups.length > 0) {
      let maxSeq = machineGroups.map(g => parseInt(g.groupCode.slice(g.groupCode.indexOf("SD")+2)))
                                .filter(n => !isNaN(n))
                                .sort((a,b)=>b-a)[0] || 0;
      nextSeq = maxSeq + 1;
    }

    let newCode = machine + "SD" + String(nextSeq).padStart(5,"0");

    let newGroup = { groupCode: newCode, process: [], items: [], materials: [] };
    if (copyData) {
      newGroup.process = JSON.parse(JSON.stringify(copyData.process));
      newGroup.items = JSON.parse(JSON.stringify(copyData.items));
      newGroup.materials = JSON.parse(JSON.stringify(copyData.materials));
    }

    groupData.push(newGroup);
  }

  closeAddGroupModal();
  renderMain();
  alert(`已新增 ${count} 個群組`);
}

function deleteGroup(i){
  if(confirm("確定刪除此群組嗎？")){
    groupData.splice(i,1);
    renderMain();
  }
}


function addProcess() {
    let list = groupData[currentGroupIndex].process;
    let nextId = list.length > 0 ? list[list.length - 1].id + 1 : 1;
    let name = ""
    list.push({ id: nextId, name: name });
    renderProcess();
    renderMain();
}
function deleteProcess(i){ groupData[currentGroupIndex].process.splice(i,1); renderProcess(); renderMain();}

// 切換到特定群組頁面
function openProcess(i){ currentGroupIndex=i; showPage("process"); }
function openItem(i){ currentGroupIndex=i; showPage("item"); }
function openMaterial(i){ currentGroupIndex=i; showPage("material"); }

function addGroup() {
  let machine = prompt("請輸入機種代碼 (如 DW、DF、DFW)：");
  if (!machine || machine.trim() === "") {
    alert("機種代碼不可為空");
    return;
  }

  machine = machine.trim().toUpperCase();

  // 找出該機種已有群組，計算序號
  let machineGroups = groupData.filter(g => g.groupCode.startsWith(machine + "SD"));

  let nextSeq = 1;
  if (machineGroups.length > 0) {
    let maxSeq = machineGroups
      .map(g => {
        let idx = g.groupCode.indexOf("SD");
        if (idx === -1) return 0;
        return parseInt(g.groupCode.slice(idx + 2)); // SD 後的數字
      })
      .filter(n => !isNaN(n))
      .sort((a, b) => b - a)[0] || 0;

    nextSeq = maxSeq + 1;
  }

  let code = machine + "SD" + String(nextSeq).padStart(5, "0");

  if (groupData.some(g => g.groupCode === code)) {
    alert("編碼重複！請重新操作");
    return;
  }

  groupData.push({
    groupCode: code,
    process: [],
    items: [],
    materials: []
  });

  renderMain();
  alert("已新增群組：" + code);
}









// 製程維護
function renderProcess(){
  let tbody=document.getElementById("process-table"); 
  tbody.innerHTML="";
  groupData[currentGroupIndex].process.forEach((p,i)=>{
    let tr=document.createElement("tr");
    tr.setAttribute("draggable","true");
    tr.dataset.index=i;

    tr.innerHTML=`
      <td>${p.id}</td>
      <td contenteditable="true">${p.name}</td>
      <td>系統依照製程代號自動帶出<br>資料來源:<a href="">規格代碼(czpft045_zf)</a></td>
      <td>11801004-鍾秉翰</td>
      <td>2025/11/18 09:00</td>
      <td><button class="delete-btn" onclick="deleteProcess(${i})">刪除</button></td>
    `;

    // ★ 編輯功能
    tr.children[1].addEventListener("input", e=>{
      p.name = e.target.innerText.trim();
      renderMain();
    });

    // ★ 拖拉功能
    tr.addEventListener("dragstart", e=>{
      e.dataTransfer.setData("text/plain", i);
      tr.style.opacity="0.5";
    });
    tr.addEventListener("dragend", ()=>{ tr.style.opacity="1"; });
    tr.addEventListener("dragover", e=>e.preventDefault());
    tr.addEventListener("drop", e=>{
      e.preventDefault();
      let fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
      let toIndex = parseInt(tr.dataset.index);
      if(fromIndex===toIndex) return;
      let list = groupData[currentGroupIndex].process;
      let moved = list.splice(fromIndex,1)[0];
      list.splice(toIndex,0,moved);
      list.forEach((p,idx)=>p.id=idx+1);
      renderProcess();
      renderMain();
    });

    tbody.appendChild(tr);
  });
}



function importProcessFromGroup() {
  let code = prompt("請輸入欲匯入的群組編號：");
  if(!code) return;

  let sourceGroup = groupData.find(g => g.groupCode === code.toUpperCase());
  if(!sourceGroup) {
    alert("找不到該群組！");
    return;
  }

  if(!confirm(`確定要清空目前群組的製程代碼，並匯入 ${code} 的資料嗎？`)) return;

  // 清空當前群組製程
  groupData[currentGroupIndex].process = [];

  // 複製來源群組製程
  sourceGroup.process.forEach(p=>{
    groupData[currentGroupIndex].process.push({
      id: p.id,
      name: p.name
    });
  });

  renderProcess();
  renderMain();
}

// 項目 / 參數維護
function renderItem(){
  let tbody=document.getElementById("item-table"); 
  tbody.innerHTML="";
  groupData[currentGroupIndex].items.forEach((item,i)=>{
    let tr=document.createElement("tr");
    tr.setAttribute("draggable","true");
    tr.dataset.index=i;

    tr.innerHTML=`
      <td>${item.id}</td>
      <td contenteditable="true">${item.name}</td>
      <td>
        <select class="format-select">
          <option value="數值" ${item.type==="數值"?"selected":""}>數值</option>
          <option value="文字" ${item.type==="文字"?"selected":""}>文字</option>
        </select>
      </td>
      <td contenteditable="true">${item.unit}</td>
      <td contenteditable="true">${item.max}</td>
      <td contenteditable="true">${item.mid}</td>
      <td contenteditable="true">${item.min}</td>
      <td><input type="checkbox" ${item.manual?"checked":""}></td>
      <td><button class="delete-btn" onclick="deleteItem(${i})">刪除</button></td>
    `;

    // ★ 編輯欄位
    let tds = tr.querySelectorAll("td[contenteditable='true']");
    tds.forEach((td,idx)=>{
      td.addEventListener("input", ()=>{
        let keys=["name","unit","max","mid","min"];
        item[keys[idx]] = td.innerText.trim();
        renderMain();
      });
    });

    // ★ 下拉選單
    let select = tr.querySelector("select");
    select.addEventListener("change", e=>{
      item.type = e.target.value;

      
      let tds = tr.querySelectorAll("td[contenteditable='true']");
      // 切換成文字自動清空數值欄位
      if(item.type === "文字") {
        item.max = "";
        item.mid = "";
        item.min = "";
      }

      renderItem();
      renderMain();
    });

    // ★ 勾選手動
    tr.querySelector("input[type='checkbox']").addEventListener("change", e=>{
      item.manual = e.target.checked;
      renderMain();
    });

    // ★ 拖拉功能
    tr.addEventListener("dragstart", e=>{
      e.dataTransfer.setData("text/plain", i);
      tr.style.opacity="0.5";
    });
    tr.addEventListener("dragend", ()=>{ tr.style.opacity="1"; });
    tr.addEventListener("dragover", e=>e.preventDefault());
    tr.addEventListener("drop", e=>{
      e.preventDefault();
      let fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
      let toIndex = parseInt(tr.dataset.index);
      if(fromIndex===toIndex) return;
      let list = groupData[currentGroupIndex].items;
      let moved = list.splice(fromIndex,1)[0];
      list.splice(toIndex,0,moved);
      list.forEach((item,idx)=>item.id=idx+1);
      renderItem();
      renderMain();
    });

    tbody.appendChild(tr);
  });
}




function importItemsFromGroup() {
  let code = prompt("請輸入欲匯入的群組編號：");
  if(!code) return;

  // 找出目標群組
  let sourceGroup = groupData.find(g => g.groupCode === code.toUpperCase());
  if(!sourceGroup) {
    alert("找不到該群組！");
    return;
  }

  if(!confirm(`確定要清空目前群組的項目，並匯入 ${code} 的資料嗎？`)) return;

  // 清空當前群組 items
  groupData[currentGroupIndex].items = [];

  // 複製來源群組 items（深複製避免共用物件）
  sourceGroup.items.forEach(it=>{
    groupData[currentGroupIndex].items.push({
      id: it.id,
      name: it.name,
      type: it.type,
      unit: it.unit,
      max: it.max,
      mid: it.mid,
      min: it.min,
      manual: it.manual
    });
  });

  // 重新渲染
  renderItem();
  renderMain();
}













function addItem(){
  let nextId=groupData[currentGroupIndex].items.length+1;
  groupData[currentGroupIndex].items.push({id:nextId,name:"新項目",type:"",unit:"",max:0,mid:0,min:0,manual:false});
  renderItem(); renderMain();
}
function deleteItem(i){ groupData[currentGroupIndex].items.splice(i,1); renderItem(); renderMain(); }


// 料號維護
function renderMaterial() {
  let tbody = document.getElementById("material-table");
  tbody.innerHTML = "";

  groupData[currentGroupIndex].materials.forEach((m, i) => {
    let tr = document.createElement("tr");
    tr.setAttribute("draggable", "true");
    tr.dataset.index = i;

    tr.innerHTML = `
      <td>${m.id}</td>
      <td contenteditable="true">${m.name}</td>
      <td>系統依照料號自動帶出<br>資料來源:<a href="">料件基本資料維護-基本資料(aimi100)</a></td>
      <td>11801004-鍾秉翰</td>
      <td>2025/11/18 09:00</td>
      <td><button class="delete-btn" onclick="deleteMaterial(${i})">刪除</button></td>
    `;

    // ★ 拖放事件
    tr.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", i); // 原始索引
      tr.style.opacity = "0.5";
    });

    tr.addEventListener("dragend", () => {
      tr.style.opacity = "1";
    });

    tr.addEventListener("dragover", (e) => e.preventDefault());

    tr.addEventListener("drop", (e) => {
      e.preventDefault();
      let fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
      let toIndex = parseInt(tr.dataset.index);

      if (fromIndex === toIndex) return;

      let list = groupData[currentGroupIndex].materials;
      let moved = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, moved);

      // 重新編號
      list.forEach((m, idx) => (m.id = idx + 1));

      renderMaterial();
      renderMain();
    });

    // ★ 監聽內容編輯
    tr.children[1].addEventListener("input", (e) => {
      m.name = e.target.innerText.trim();
      renderMain();
    });

    tbody.appendChild(tr);
  });
}

function importMaterialsFromGroup() {
  let code = prompt("請輸入欲匯入的群組編號：");
  if(!code) return;

  let sourceGroup = groupData.find(g => g.groupCode === code.toUpperCase());
  if(!sourceGroup) {
    alert("找不到該群組！");
    return;
  }

  if(!confirm(`確定要清空目前群組的料號，並匯入 ${code} 的資料嗎？`)) return;

  // 清空當前群組料號
  groupData[currentGroupIndex].materials = [];

  // 複製來源群組料號
  sourceGroup.materials.forEach(m=>{
    groupData[currentGroupIndex].materials.push({
      id: m.id,
      name: m.name
    });
  });

  renderMaterial();
  renderMain();
}




function addMaterial(){ 
  let list=groupData[currentGroupIndex].materials;
  let nextId=list.length+1;
  list.push({
    id:nextId,
    name:""
  }); 
  renderMaterial();
  renderMain();}
function deleteMaterial(i){ 
  groupData[currentGroupIndex].materials.splice(i,1); 
  groupData[currentGroupIndex].materials.forEach((m,idx)=>m.id=idx+1);
  
  renderMaterial(); renderMain();}






// Excel 匯出/匯入
function exportExcel(){
  let wb=XLSX.utils.book_new();
  groupData.forEach((group,index)=>{
    let data=[["編號","製程"],...group.process.map(p=>[p.id,p.name])];
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(data),group.groupCode+"_Process");
    let itemData=[["編號","項目","格式","單位","上","中","下","手動"]];
    group.items.forEach(i=>itemData.push([i.id,i.name,i.type,i.unit,i.max,i.mid,i.min,i.manual?"TRUE":"FALSE"]));
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(itemData),group.groupCode+"_Item");
    let matData=[["編號","料號"],...group.materials.map(m=>[m.id,m.name])];
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(matData),group.groupCode+"_Material");
  });
  XLSX.writeFile(wb,"GroupData.xlsx");
}

function importExcel(event){
  let file = event.target.files[0];
  if(!file) return;

  let reader = new FileReader();
  reader.onload = function(e){
    let data = new Uint8Array(e.target.result);
    let wb = XLSX.read(data, {type:'array'});

    wb.SheetNames.forEach(sheetName => {
      let arr = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});
      if(arr.length < 2) return;

      // 取 groupCode
      let code = sheetName.split("_")[0];

      // 找現有 group 或建立新 group
      let g = groupData.find(g => g.groupCode === code);
      if(!g){
        g = { groupCode:code, process:[], items:[], materials:[] };
        groupData.push(g);
      }

      // ------------------------------
      // Process
      // ------------------------------
      if(sheetName.includes("_Process")){
        g.process = arr.slice(1)
          .filter(r => r && r[1])
          .map((r,idx)=>({
            id: idx + 1,
            name: r[1]
          }));
      }

      // ------------------------------
      // Item
      // ------------------------------
      else if(sheetName.includes("_Item")){
        g.items = arr.slice(1)
          .filter(r => r && r[1])
          .map(r => ({
            id: r[0] || 0,
            name: r[1] || "",
            type: r[2] || "",
            unit: r[3] || "",
            max: r[4] || "",
            mid: r[5] || "",
            min: r[6] || "",
            manual: r[7] === "TRUE"
          }));
      }

      // ------------------------------
      // Material
      // ------------------------------
      else if(sheetName.includes("_Material")){
        g.materials = arr.slice(1)
          .filter(r => r && r[1])
          .map((r,idx)=>({
            id: idx + 1,
            name: r[1]
          }));
      }
    });

    renderMain();
    alert("匯入完成！");
  };

  reader.readAsArrayBuffer(file);
}

showPage("main");
document.getElementById("toggleAll").addEventListener("change", function () {
    let checked = this.checked;

    // 找出所有「個別隱藏」的 checkbox
    const allCB = document.querySelectorAll("input[type='checkbox'][data-hide='1']");

    allCB.forEach(cb => {
        cb.checked = checked;   // 把勾選狀態同步
        toggleSubTable(cb);     // 呼叫你原本的顯示/隱藏邏輯
    });
});

// 篩選
function filterGroups() {
  let filter = document.getElementById("filterInput").value.trim().toUpperCase();
  let tbody = document.getElementById("main-table-body");
  tbody.innerHTML = "";

  groupData.forEach((group, index) => {
    if (group.groupCode.toUpperCase().includes(filter)) {

      let itemHTML = `<table class="sub-table" style="display:none"><thead><tr>
        <th style="font-size: 10px;">項目</th>
        <th style="font-size: 10px;">格式</th>
        <th style="font-size: 10px;">單位</th>
        <th style="font-size: 10px;">上限</th>
        <th style="font-size: 10px;">中間</th>
        <th style="font-size: 10px;">下限</th>
        <th style="font-size: 10px;">手動</th>
      </tr></thead><tbody>`;
      group.items.forEach(item => {
        itemHTML += `<tr>
          <td>${item.name}</td>
          <td>${item.type}</td>
          <td>${item.unit}</td>
          <td>${item.max}</td>
          <td>${item.mid}</td>
          <td>${item.min}</td>
          <td>${item.manual ? "✔" : ""}</td>
        </tr>`;
      });
      itemHTML += "</tbody></table>";

      let matHTML = `<div class="sub-table-container"><div class="sub-table-grid">`;
      group.materials.forEach(m => { matHTML += `<div>${m.name}</div>`; });
      matHTML += "</div></div>";

      let processHTML = `<div class="sub-table-container"><div class="sub-table-grid">`;
      group.process.forEach(p => { processHTML += `<div>${p.name}</div>`; });
      processHTML += "</div></div>";

      tbody.innerHTML += `<tr>
        <td>${group.groupCode}</td>
        <td>${processHTML}</td>
        <td>${itemHTML}</td>
        <td>${matHTML}</td>
        <td>
          <input type="checkbox" data-hide="1" onchange="toggleSubTable(this)">顯示
          <button onclick="openProcess(${index})">製程</button>
          <button onclick="openItem(${index})">項目參數</button>
          <button onclick="openMaterial(${index})">料號</button>
          <button class="delete-btn" onclick="deleteGroup(${index})">刪除群組</button>
        </td>
      </tr>`;
    }
  });
}

function addMaterial() {
  document.getElementById("materialInput").value = "";
  document.getElementById("materialModal").style.display = "flex";
}

function closeMaterialModal() {
  document.getElementById("materialModal").style.display = "none";
}

function confirmMaterial() {
  let input = document.getElementById("materialInput").value;

  if (!input.trim()) {
    alert("請輸入料號！");
    return;
  }

  // 支援逗號與換行
  let list = input
    .split(/[\n,]+/)
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // 過濾掉已存在的料號
  let existing = groupData[currentGroupIndex].materials.map(m => m.name);
  list = list.filter(m => !existing.includes(m));

  if(list.length === 0){
    alert("輸入的料號都已存在！");
    return;
  }

  // 加入 groupData 結構
  list.forEach(m => {
    let nextId = groupData[currentGroupIndex].materials.length + 1;
    groupData[currentGroupIndex].materials.push({
      id: nextId,
      name: m
    });
  });

  closeMaterialModal();
  renderMaterial(); // 更新畫面
}

// 打開新增製程彈窗
function addProcess() {
  document.getElementById("processInput").value = "";
  document.getElementById("processModal").style.display = "flex";
}

// 關閉彈窗
function closeProcessModal() {
  document.getElementById("processModal").style.display = "none";
}

// 確認新增製程
function confirmProcess() {
  let input = document.getElementById("processInput").value;

  if (!input.trim()) {
    alert("請輸入製程代碼！");
    return;
  }

  // 支援逗號或換行
  let list = input
    .split(/[\n,]+/)
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // 過濾掉已存在的製程
  let existing = groupData[currentGroupIndex].process.map(p => p.name);
  list = list.filter(p => !existing.includes(p));

  if(list.length === 0){
    alert("輸入的製程代碼都已存在！");
    return;
  }

  // 加入 groupData
  list.forEach(p => {
    let nextId = groupData[currentGroupIndex].process.length + 1;
    groupData[currentGroupIndex].process.push({
      id: nextId,
      name: p
    });
  });

  closeProcessModal();
  renderProcess(); // 更新製程表
  renderMain();    // 同步更新主頁面
}
