import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const diagrams = path.join(root, 'so_do');
fs.mkdirSync(diagrams, { recursive: true });

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, value, options = {}) => {
  const { size = 15, weight = 400, anchor = 'middle', fill = '#172033' } = options;
  const lines = String(value).split('\n');
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 19 : 0}">${esc(line)}</tspan>`).join('')}</text>`;
};
const rect = (x, y, w, h, label, options = {}) => {
  const { fill = '#f8fbff', stroke = '#2457c5', radius = 10, title = false } = options;
  const lines = String(label).split('\n');
  const startY = y + h / 2 - ((lines.length - 1) * 9) + 5;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>${text(x + w / 2, startY, label, { size: title ? 16 : 14, weight: title ? 700 : 500 })}`;
};
const line = (x1, y1, x2, y2, options = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${options.stroke || '#475569'}" stroke-width="${options.width || 1.6}" ${options.dash ? 'stroke-dasharray="6 5"' : ''} ${options.arrow === false ? '' : 'marker-end="url(#arrow)"'}/>`;
const svg = (w, h, title, body) => `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#475569"/></marker></defs><rect width="100%" height="100%" fill="white"/><text x="${w/2}" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#0f172a">${esc(title)}</text>${body}</svg>`;
const save = (name, content) => fs.writeFileSync(path.join(diagrams, name), content, 'utf8');

// Use case
let body = `<rect x="185" y="48" width="630" height="480" rx="16" fill="#fbfdff" stroke="#94a3b8" stroke-width="1.5"/>${text(500,72,'HỆ THỐNG LEARNUP',{size:15,weight:700})}`;
const actors = [['Học viên',80,180],['Giáo viên',80,360],['Quản trị viên',920,270]];
for (const [label,x,y] of actors) body += `<circle cx="${x}" cy="${y-42}" r="15" fill="none" stroke="#172033" stroke-width="2"/><line x1="${x}" y1="${y-27}" x2="${x}" y2="${y+18}" stroke="#172033" stroke-width="2"/><line x1="${x-22}" y1="${y-8}" x2="${x+22}" y2="${y-8}" stroke="#172033" stroke-width="2"/><line x1="${x}" y1="${y+18}" x2="${x-20}" y2="${y+48}" stroke="#172033" stroke-width="2"/><line x1="${x}" y1="${y+18}" x2="${x+20}" y2="${y+48}" stroke="#172033" stroke-width="2"/>${text(x,y+72,label,{size:14,weight:700})}`;
const cases = [['Xác thực tài khoản',500,105],['Khám phá và mua khóa học',360,175],['Học bài và làm quiz',360,245],['Hỏi trợ lý AI',360,315],['Xây dựng nội dung khóa học',640,175],['Quản lý học viên, doanh thu',640,245],['Kiểm duyệt khóa học',640,335],['Quản lý người dùng, danh mục',640,415]];
for (const [label,x,y] of cases) body += `<ellipse cx="${x}" cy="${y}" rx="125" ry="29" fill="#eef4ff" stroke="#2457c5" stroke-width="1.6"/>${text(x,y+5,label,{size:13})}`;
for (const y of [105,175,245,315]) body += line(125,180,235,y,{arrow:false});
for (const y of [105,175,245]) body += line(125,360,515,y,{arrow:false});
for (const y of [105,335,415]) body += line(875,270,765,y,{arrow:false});
save('01-use-case.svg', svg(1000,560,'Sơ đồ use case tổng quát',body));

// Architecture
body = rect(55,105,190,80,'Trình duyệt\nReact + Router + Tailwind',{title:true}) + line(245,145,345,145) + text(295,130,'HTTPS / JSON',{size:12}) + rect(345,90,250,110,'Spring Security\nJWT Filter · CORS · RBAC',{title:true}) + line(595,145,700,145) + rect(700,105,220,80,'REST Controllers\nBusiness Rules',{title:true});
body += line(810,185,810,275) + rect(685,275,250,85,'Spring Data JPA\nRepositories · Entities',{title:true}) + line(685,317,535,317) + rect(285,275,250,85,'Microsoft SQL Server\n12 bảng dữ liệu',{title:true});
body += line(810,275,810,430) + rect(660,430,150,70,'Demo Payment',{title:true}) + rect(830,430,135,70,'Gemini API',{title:true});
save('02-kien-truc.svg',svg(1000,540,'Kiến trúc client–server của LearnUp',body));

// Class diagram
const classes = [
  ['User','id, name, email\npassword, role, status',40,70],['Category','id, name',390,70],['Course','id, title, price, status\nteacher, category',700,70],
  ['Enrollment','id, student, course',40,245],['Order','orderCode, amount\nmethod, status, timestamps',270,245],['Chapter','id, title, orderIndex\ncourse',510,245],['Quiz','id, title, passScore\ntimeLimit, course',750,245],
  ['LessonProgress','student, lesson\nisCompleted',40,420],['Lesson','id, title, videoUrl\norderIndex, chapter',360,420],['QuizResult','student, quiz, score\npassed, timestamps',650,420],['Question / Option','content, explanation\noptions, isCorrect',820,420]
];
body=''; for(const [name,attrs,x,y] of classes) body += rect(x,y,name==='Question / Option'?155:190,95,`${name}\n────────────\n${attrs}`,{fill:'#f8fafc',stroke:'#334155',title:false});
body += line(230,115,700,115,{arrow:false})+text(465,105,'1 teacher                N',{size:12})+line(580,115,700,115,{arrow:false})+text(640,105,'1 category       N',{size:12});
body += line(135,165,135,245,{arrow:false})+line(230,292,270,292,{arrow:false})+line(795,165,605,245,{arrow:false})+line(795,165,845,245,{arrow:false});
body += line(605,340,455,420,{arrow:false})+line(135,340,135,420,{arrow:false})+line(845,340,727,420,{arrow:false})+line(845,340,897,420,{arrow:false});
save('03-lop.svg',svg(1000,550,'Sơ đồ lớp miền nghiệp vụ',body));

function sequence(name,title,participants,steps){ const w=1000,h=520,xs=participants.map((_,i)=>90+i*(820/(participants.length-1))); let b=''; participants.forEach((p,i)=>{b+=rect(xs[i]-75,55,150,48,p,{fill:'#eef4ff',title:true})+line(xs[i],103,xs[i],480,{dash:true,arrow:false});}); steps.forEach((s,i)=>{const y=135+i*45; b+=line(xs[s.from],y,xs[s.to],y,{dash:s.dash}); b+=text((xs[s.from]+xs[s.to])/2,y-7,s.label,{size:12});}); save(name,svg(w,h,title,b)); }
sequence('04-tuan-tu-dang-nhap.svg','Sơ đồ tuần tự đăng nhập',['Người dùng','React','AuthController','Repository','JWT Service'],[
  {from:0,to:1,label:'Nhập email, mật khẩu'},{from:1,to:2,label:'POST /api/auth/login'},{from:2,to:3,label:'findByEmail()'},{from:3,to:2,label:'User',dash:true},{from:2,to:2,label:'BCrypt matches()'},{from:2,to:4,label:'Tạo JWT'},{from:4,to:2,label:'Token',dash:true},{from:2,to:1,label:'200 + token + user',dash:true},{from:1,to:0,label:'Điều hướng theo vai trò',dash:true}
]);
sequence('05-tuan-tu-thanh-toan.svg','Sơ đồ tuần tự thanh toán demo và ghi danh',['Học viên','React','OrderController','Demo Payment','SQL Server'],[
  {from:0,to:1,label:'Xác nhận thanh toán demo'},{from:1,to:2,label:'POST /api/orders'},{from:2,to:4,label:'Lưu order PENDING'},{from:2,to:1,label:'Trả orderId',dash:true},{from:1,to:3,label:'POST /demo-pay'},{from:3,to:2,label:'Yêu cầu hoàn tất demo'},{from:2,to:4,label:'DEMO_PAY + COMPLETED'},{from:2,to:4,label:'Tạo Enrollment'},{from:2,to:1,label:'Kích hoạt thành công',dash:true},{from:1,to:0,label:'Mở khóa học',dash:true}
]);

// Activity
body=''; const activity=[['Bắt đầu',40],['Tạo khóa học (draft)',100],['Thêm chương, bài học, quiz',170],['Gửi duyệt (pending)',240],['Admin kiểm tra nội dung',310]]; for(let i=0;i<activity.length;i++){body+=rect(350,activity[i][1],300,45,activity[i][0],{fill:i===0?'#dcfce7':'#f8fbff'}); if(i<activity.length-1)body+=line(500,activity[i][1]+45,500,activity[i+1][1]);} body+=line(500,355,270,405)+line(500,355,730,405); body+=rect(130,405,280,55,'Không đạt: rejected\nGhi lý do',{fill:'#fff1f2',stroke:'#e11d48'})+rect(590,405,280,55,'Đạt: published\nCông khai và mở bán',{fill:'#ecfdf5',stroke:'#059669'}); body+=line(270,460,270,500)+line(270,500,330,500)+line(330,500,330,122); body+=text(240,390,'Không',{size:12,weight:700})+text(755,390,'Có',{size:12,weight:700});
save('06-hoat-dong.svg',svg(1000,560,'Sơ đồ hoạt động kiểm duyệt khóa học',body));

// State
body=rect(40,210,120,55,'draft',{title:true})+line(160,237,260,237)+rect(260,210,130,55,'pending',{title:true})+line(390,237,500,155)+rect(500,125,150,55,'published',{fill:'#ecfdf5',stroke:'#059669',title:true})+line(390,237,500,320)+rect(500,290,150,55,'rejected',{fill:'#fff1f2',stroke:'#e11d48',title:true});
body+=line(575,290,130,265)+text(355,292,'Chỉnh sửa lại',{size:12})+line(650,152,760,152)+rect(760,125,150,55,'suspended',{fill:'#fff7ed',stroke:'#ea580c',title:true})+line(835,180,650,180)+text(710,116,'Tạm ngưng / khôi phục',{size:12});
body+=rect(430,440,150,55,'archived',{fill:'#f1f5f9',stroke:'#64748b',title:true})+line(100,265,430,467)+line(325,265,460,440)+line(575,180,525,440)+line(575,345,545,440); text(500,420,'Lưu trữ',{size:12});
save('07-trang-thai.svg',svg(1000,540,'Sơ đồ trạng thái khóa học',body));

// ERD
const entities=[['USERS',40,80],['CATEGORIES',390,80],['COURSES',700,80],['ENROLLMENTS',40,250],['ORDERS',270,250],['CHAPTERS',510,250],['QUIZZES',750,250],['LESSON_PROGRESS',40,430],['LESSONS',360,430],['QUIZ_RESULTS',650,430],['QUESTIONS / OPTIONS',820,430]];
body=''; for(const [n,x,y] of entities)body+=rect(x,y,n==='QUESTIONS / OPTIONS'?155:170,60,n,{fill:'#f8fafc',stroke:'#334155',title:true});
body+=line(210,110,700,110,{arrow:false})+text(460,101,'1 giáo viên                                      N',{size:11})+line(560,110,700,110,{arrow:false})+text(630,101,'1 danh mục        N',{size:11});
body+=line(125,140,125,250,{arrow:false})+line(210,280,270,280,{arrow:false})+line(785,140,595,250,{arrow:false})+line(785,140,835,250,{arrow:false});
body+=line(595,310,445,430,{arrow:false})+line(125,310,125,430,{arrow:false})+line(835,310,735,430,{arrow:false})+line(835,310,897,430,{arrow:false});
body+=text(500,530,'Các bảng trung gian dùng khóa ngoại và ràng buộc duy nhất để bảo đảm toàn vẹn dữ liệu.',{size:13});
save('08-erd.svg',svg(1000,555,'Sơ đồ thực thể liên kết (ERD)',body));

const figures = [
  ['Hình 3.1. Sơ đồ use case tổng quát của LearnUp','01-use-case.svg'],
  ['Hình 3.2. Kiến trúc tổng thể hệ thống','02-kien-truc.svg'],
  ['Hình 3.3. Sơ đồ lớp miền nghiệp vụ','03-lop.svg'],
  ['Hình 3.4. Sơ đồ tuần tự đăng nhập','04-tuan-tu-dang-nhap.svg'],
  ['Hình 3.5. Sơ đồ tuần tự thanh toán và ghi danh','05-tuan-tu-thanh-toan.svg'],
  ['Hình 3.6. Sơ đồ hoạt động kiểm duyệt khóa học','06-hoat-dong.svg'],
  ['Hình 3.7. Sơ đồ trạng thái khóa học','07-trang-thai.svg'],
  ['Hình 3.8. Sơ đồ ERD rút gọn','08-erd.svg']
];
let html=fs.readFileSync(path.join(root,'BAO_CAO_HOAN_CHINH.html'),'utf8');
for(const [caption,file] of figures){
  const safe=caption.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp(`<div class="diagram">[\\s\\S]*?<\\/div>\\s*<p class="caption">${safe}<\\/p>`);
  const imagePath=path.join(diagrams,file).replaceAll('\\','/');
  html=html.replace(pattern,`<p class="center"><img src="file:///${imagePath}" style="width:100%;max-width:16cm"></p><p class="caption">${caption}</p>`);
}
fs.writeFileSync(path.join(root,'BAO_CAO_UML.html'),html,'utf8');
console.log(`Generated ${figures.length} SVG diagrams and BAO_CAO_UML.html`);
