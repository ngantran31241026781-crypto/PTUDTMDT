import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Filter,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  X,
  Pencil,
  Trash2,
  ChartNoAxesColumnIncreasing,
} from 'lucide-react';

const STORAGE_KEY = 'today-tasks-v1';
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const PRIORITIES = ['Thấp', 'Trung bình', 'Cao'];

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(date = new Date()) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return monday;
}

function createStarterTasks() {
  const date = localDateKey();
  return [
    { id: crypto.randomUUID(), title: 'Lên kế hoạch tuần mới', time: '08:30', priority: 'Cao', done: true, date },
    { id: crypto.randomUUID(), title: 'Hoàn thiện bản thiết kế landing page', time: '09:30', priority: 'Cao', done: false, date },
    { id: crypto.randomUUID(), title: 'Gửi email cập nhật cho đội ngũ', time: '11:00', priority: 'Trung bình', done: false, date },
    { id: crypto.randomUUID(), title: 'Đọc 20 trang sách', time: '14:00', priority: 'Thấp', done: false, date },
    { id: crypto.randomUUID(), title: 'Đi bộ và thư giãn', time: '17:30', priority: 'Trung bình', done: false, date },
  ];
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return createStarterTasks();
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : createStarterTasks();
  } catch {
    return createStarterTasks();
  }
}

function dateHeading() {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());
}

function IconBadge({ children, className = '' }) {
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}>{children}</span>;
}

function TaskDialog({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [date, setDate] = useState(task?.date ?? localDateKey());
  const [time, setTime] = useState(task?.time ?? '09:00');
  const [priority, setPriority] = useState(task?.priority ?? 'Trung bình');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Hãy nhập tên công việc.');
      return;
    }
    onSave({ title: title.trim(), date, time, priority });
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form onSubmit={submit} className="fade-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7" aria-labelledby="dialog-title">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green">{task ? 'Cập nhật' : 'Thêm vào lịch'}</p>
            <h2 id="dialog-title" className="mt-1 font-display text-xl font-extrabold">{task ? 'Sửa công việc' : 'Công việc mới'}</h2>
          </div>
          <button type="button" onClick={onClose} className="-mr-2 -mt-2 rounded-lg p-2 text-muted hover:bg-canvas" aria-label="Đóng"><X size={19} /></button>
        </div>
        <label className="mb-2 block text-xs font-semibold" htmlFor="task-title">Tên công việc</label>
        <input id="task-title" autoFocus maxLength={120} value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} placeholder="Ví dụ: Hoàn thành bản kế hoạch" className="w-full rounded-xl border border-line px-3.5 py-3 text-sm outline-none focus:border-green focus:ring-2 focus:ring-green/10" />
        {error && <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div><label className="mb-2 block text-xs font-semibold" htmlFor="task-date">Ngày thực hiện</label><input id="task-date" required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-line px-3 py-3 text-sm outline-none focus:border-green" /></div>
          <div><label className="mb-2 block text-xs font-semibold" htmlFor="task-time">Giờ thực hiện</label><input id="task-time" required type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-xl border border-line px-3 py-3 text-sm outline-none focus:border-green" /></div>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-2 text-xs font-semibold">Mức độ ưu tiên</legend>
          <div className="grid grid-cols-3 gap-2">{PRIORITIES.map((item) => <button type="button" key={item} onClick={() => setPriority(item)} aria-pressed={priority === item} className={`rounded-xl border py-2.5 text-xs font-semibold transition ${priority === item ? 'border-green bg-[#edf3e9] text-green' : 'border-line text-muted hover:border-[#bdc9b8]'}`}>{item}</button>)}</div>
        </fieldset>
        <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink">Hủy</button><button type="submit" className="rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#36583b]">{task ? 'Lưu thay đổi' : 'Thêm công việc'}</button></div>
      </form>
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon, accent = false }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted">{label}</span><IconBadge className={accent ? 'bg-[#eaf0e5] text-green' : 'bg-canvas text-muted'}><Icon size={17} /></IconBadge></div>
      <p className="mt-3 font-display text-[34px] font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [tab, setTab] = useState('today');
  const [filter, setFilter] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');
  const [period, setPeriod] = useState('Tuần này');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch { setToast('Không thể lưu dữ liệu trên thiết bị này.'); }
  }, [tasks]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const today = localDateKey();
  const todayTasks = useMemo(() => tasks.filter((task) => task.date === today).sort((a, b) => a.time.localeCompare(b.time)), [tasks, today]);
  const visibleTasks = todayTasks.filter((task) => {
    const matchesFilter = filter === 'Tất cả' || (filter === 'Đang làm' ? !task.done : task.done);
    return matchesFilter && task.title.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'));
  });
  const completedToday = todayTasks.filter((task) => task.done).length;
  const progress = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  const weekData = useMemo(() => {
    const monday = startOfWeek();
    return WEEKDAYS.map((label, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const key = localDateKey(date);
      const dailyTasks = tasks.filter((task) => task.date === key);
      return { label, key, total: dailyTasks.length, done: dailyTasks.filter((task) => task.done).length };
    });
  }, [tasks]);
  const weekTotal = weekData.reduce((sum, day) => sum + day.total, 0);
  const weekDone = weekData.reduce((sum, day) => sum + day.done, 0);
  const total = period === 'Hôm nay' ? todayTasks.length : weekTotal;
  const done = period === 'Hôm nay' ? completedToday : weekDone;
  const open = total - done;

  function saveTask(data) {
    if (dialog?.task) {
      setTasks((current) => current.map((task) => task.id === dialog.task.id ? { ...task, ...data } : task));
      setToast('Đã cập nhật công việc');
    } else {
      setTasks((current) => [...current, { ...data, id: crypto.randomUUID(), done: false }]);
      setToast('Đã thêm công việc mới');
    }
    setDialog(null);
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setToast('Đã xóa công việc');
  }

  function addMockData() {
    const titles = [
      'Chuẩn bị nội dung cho buổi họp', 'Trả lời tin nhắn khách hàng', 'Tập thể dục buổi sáng',
      'Ôn lại ghi chú dự án', 'Mua đồ dùng trong nhà', 'Cập nhật portfolio cá nhân',
      'Gọi điện cho gia đình', 'Dọn dẹp bàn làm việc', 'Lên thực đơn cho tuần', 'Hoàn thành báo cáo tháng',
    ];
    const monday = startOfWeek();
    const mockTasks = titles.map((title, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + (index % 7));
      return {
        id: crypto.randomUUID(), title,
        time: `${String(8 + (index % 9)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
        priority: PRIORITIES[index % PRIORITIES.length],
        done: index === 1 || index === 6,
        date: localDateKey(date),
      };
    });
    setTasks((current) => [...current, ...mockTasks]);
    setToast('Đã thêm 10 công việc mẫu');
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1120px] px-5 py-7 sm:px-8 sm:py-10">
        <header className="mb-10 flex items-center justify-between sm:mb-14">
          <button onClick={() => setTab('today')} className="flex items-center gap-2.5 text-ink" aria-label="Daymark, về Hôm nay">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-lime"><Check size={20} /></span>
            <span className="font-display text-[18px] font-extrabold tracking-tight">daymark<span className="text-green">.</span></span>
          </button>
          <nav aria-label="Điều hướng chính" className="flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
            <button onClick={() => setTab('today')} className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${tab === 'today' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>Hôm nay</button>
            <button onClick={() => setTab('stats')} className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${tab === 'stats' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>Thống kê</button>
          </nav>
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex"><span className="h-2 w-2 rounded-full bg-[#8ab773]" />Lưu trên thiết bị</div>
        </header>

        {tab === 'today' ? (
          <main className="fade-in">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_290px] lg:gap-12">
              <section>
                <div className="mb-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[.15em] text-green">{dateHeading()}</p>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><h1 className="font-display text-[36px] font-extrabold leading-tight tracking-[-.045em] sm:text-[44px]">Một ngày có chủ đích<span className="text-green">.</span></h1><p className="mt-2 text-muted">Từng bước nhỏ, tiến gần hơn đến điều quan trọng.</p></div>
                    <button onClick={() => setDialog({})} className="inline-flex items-center gap-2 rounded-xl bg-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#36583b]"><Plus size={17} />Thêm công việc</button>
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                  <label className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công việc..." aria-label="Tìm theo tên công việc" className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-green focus:ring-2 focus:ring-green/10" /></label>
                  <label className="relative"><Filter size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Lọc theo trạng thái" className="w-full appearance-none rounded-xl border border-line bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-green sm:w-auto"><option>Tất cả</option><option>Đang làm</option><option>Hoàn thành</option></select><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">▾</span></label>
                </div>

                <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                  <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6"><span className="text-sm font-bold">Danh sách hôm nay</span><span className="text-xs text-muted">{todayTasks.length} công việc</span></div>
                  {visibleTasks.length ? <div>{visibleTasks.map((task, index) => (
                    <article key={task.id} className={`task-row flex items-center gap-3 px-5 py-[17px] sm:gap-4 sm:px-6 ${index < visibleTasks.length - 1 ? 'border-b border-line/80' : ''}`}>
                      <button onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'} aria-pressed={task.done} className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border transition ${task.done ? 'border-green bg-green text-white' : 'border-[#cfd4cd] text-transparent hover:border-green'}`}><Check size={13} /></button>
                      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className={`truncate text-sm font-semibold ${task.done ? 'text-muted line-through' : ''}`}>{task.title}</p>{task.done && <span className="hidden text-[10px] font-bold uppercase tracking-wider text-green sm:inline">Xong</span>}</div><div className="mt-1.5 flex items-center gap-2 text-xs text-muted"><span className="inline-flex items-center gap-1"><Clock3 size={13} />{task.time}</span><span className="h-[3px] w-[3px] rounded-full bg-[#c5cac3]" /><span className={`inline-flex items-center gap-1 ${task.priority === 'Cao' ? 'text-[#bf7059]' : task.priority === 'Thấp' ? 'text-[#7e9680]' : 'text-[#a38755]'}`}><span className={`h-1.5 w-1.5 rounded-full ${task.priority === 'Cao' ? 'bg-[#d8846c]' : task.priority === 'Thấp' ? 'bg-[#92ab8b]' : 'bg-[#cfad6c]'}`} />{task.priority}</span></div></div>
                      <div className="row-actions flex items-center gap-1 opacity-0 transition"><button onClick={() => setDialog({ task })} aria-label={`Sửa ${task.title}`} className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-green"><Pencil size={16} /></button><button onClick={() => deleteTask(task.id)} aria-label={`Xóa ${task.title}`} className="rounded-lg p-2 text-muted hover:bg-[#fff7f4] hover:text-[#bb6653]"><Trash2 size={16} /></button></div>
                    </article>
                  ))}</div> : <div className="py-14 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-green">{query || filter !== 'Tất cả' ? <Search size={22} /> : <Sparkles size={22} />}</div><p className="text-sm font-semibold">{query || filter !== 'Tất cả' ? 'Không tìm thấy công việc' : 'Lịch hôm nay đang rộng mở'}</p><p className="mt-1 text-xs text-muted">{query || filter !== 'Tất cả' ? 'Thử thay đổi từ khóa hoặc bộ lọc.' : 'Thêm một việc nhỏ để bắt đầu nhé.'}</p></div>}
                </div>
                <p className="mt-4 text-center text-xs text-muted">Mẹo nhỏ: chọn vòng tròn để cập nhật trạng thái hoàn thành.</p>
              </section>

              <aside className="space-y-4 lg:pt-[74px]">
                <div className="rounded-2xl border border-[#e0e9d9] bg-[#eaf0e5] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-green/80">Tiến độ hôm nay</p><p className="mt-2 font-display text-[34px] font-extrabold tracking-tight">{progress}<span className="text-xl text-green/60">%</span></p></div><IconBadge className="bg-white/80 text-green"><ChartNoAxesColumnIncreasing size={19} /></IconBadge></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${progress}%` }} /></div><div className="mt-3 flex justify-between text-xs"><span className="font-semibold text-green">{completedToday} đã hoàn thành</span><span className="text-[#75816e]">{todayTasks.length - completedToday} còn lại</span></div></div>
                <div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><span className="text-green"><CalendarDays size={17} /></span><h2 className="text-sm font-bold">Một lời nhắc</h2></div><p className="text-sm leading-relaxed text-[#555e54]">“Bạn không cần nhìn thấy cả cầu thang. Chỉ cần bước lên bậc đầu tiên.”</p><p className="mt-3 text-[11px] text-muted">— Martin Luther King Jr.</p></div>
                <div className="relative overflow-hidden rounded-2xl bg-ink p-5 text-white"><div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-lime/10" /><div className="relative"><p className="text-xs text-white/60">Đang tập trung vào</p><p className="mt-1 font-bold">Điều quan trọng nhất</p><p className="mt-2 text-xs leading-relaxed text-white/55">Hoàn thành một việc có ý nghĩa trước khi chuyển sang việc tiếp theo.</p><span className="mt-4 inline-flex text-lime"><ArrowUpRight size={17} /></span></div></div>
              </aside>
            </div>
          </main>
        ) : (
          <main className="fade-in">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.15em] text-green">Nhìn lại hành trình</p><h1 className="font-display text-[38px] font-extrabold leading-tight tracking-[-.045em] sm:text-[44px]">Thống kê<span className="text-green">.</span></h1><p className="mt-2 text-muted">Mỗi bước tiến đều đáng được ghi nhận.</p></div><button onClick={addMockData} className="inline-flex self-start items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink transition hover:bg-[#cde96d] sm:self-auto"><Sparkles size={17} />Tạo dữ liệu mẫu</button></div>
            <div className="mb-5 flex w-fit items-center gap-1 rounded-xl border border-line bg-white p-1"><button onClick={() => setPeriod('Hôm nay')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${period === 'Hôm nay' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>Hôm nay</button><button onClick={() => setPeriod('Tuần này')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${period === 'Tuần này' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>Tuần này</button></div>
            <div className="mb-5 grid gap-4 sm:grid-cols-3"><StatCard label="Tổng công việc" value={total} hint={period === 'Hôm nay' ? 'Trong ngày hôm nay' : 'Trong tuần này'} icon={ListTodo} /><StatCard label="Đã hoàn thành" value={done} hint={total ? `${Math.round((done / total) * 100)}% tổng công việc` : 'Chưa có dữ liệu'} icon={CheckCircle2} accent /><StatCard label="Đang thực hiện" value={open} hint="Việc đang chờ bạn" icon={Clock3} /></div>
            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-7"><div className="mb-8 flex items-start justify-between"><div><h2 className="font-bold">Nhịp độ trong tuần</h2><p className="mt-1 text-xs text-muted">Khối đậm là công việc đã hoàn thành</p></div><span className="rounded-lg bg-canvas px-3 py-2 text-xs text-muted">Thứ 2 – Chủ nhật</span></div><div className="flex h-[190px] items-end justify-between gap-3">{weekData.map((day) => { const max = Math.max(...weekData.map((item) => item.total), 1); const height = day.total ? Math.max(16, Math.round((day.total / max) * 145)) : 4; const doneHeight = day.total ? Math.round((day.done / day.total) * height) : 0; return <div key={day.key} className="flex flex-1 flex-col items-center gap-3"><span className="text-[11px] text-muted">{day.total ? `${day.done}/${day.total}` : ''}</span><div className="flex h-[145px] w-full max-w-[42px] items-end"><div className="relative w-full overflow-hidden rounded-t-lg bg-[#eaf0e5]" style={{ height }}><div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-green transition-all" style={{ height: doneHeight }} /></div></div><span className={`text-[11px] ${day.key === today ? 'font-bold text-green' : 'text-muted'}`}>{day.label}</span></div>; })}</div><div className="mt-6 flex gap-4 border-t border-line pt-4"><span className="inline-flex items-center gap-2 text-xs text-muted"><span className="h-2.5 w-2.5 rounded-sm bg-green" />Hoàn thành</span><span className="inline-flex items-center gap-2 text-xs text-muted"><span className="h-2.5 w-2.5 rounded-sm bg-[#eaf0e5]" />Đang làm</span></div></section>
              <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-7"><h2 className="font-bold">Tổng quan {period.toLocaleLowerCase('vi')}</h2><p className="mb-7 mt-1 text-xs text-muted">Tiến độ hoàn thành của bạn</p><div className="flex items-center gap-6"><div className="relative h-[138px] w-[138px] shrink-0"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="#edf0eb" strokeWidth="12" /><circle cx="60" cy="60" r="48" fill="none" stroke="#466b4b" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${total ? (done / total) * 301.6 : 0} 301.6`} className="transition-all duration-500" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-[27px] font-extrabold leading-none">{total ? Math.round((done / total) * 100) : 0}%</span><span className="mt-1 text-[10px] text-muted">hoàn thành</span></div></div><div className="space-y-4"><div><div className="flex items-center gap-2 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-green" />Đã hoàn thành</div><p className="ml-4 mt-0.5 text-lg font-bold">{done} <span className="text-xs font-normal text-muted">công việc</span></p></div><div><div className="flex items-center gap-2 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-[#e1e6de]" />Đang thực hiện</div><p className="ml-4 mt-0.5 text-lg font-bold">{open} <span className="text-xs font-normal text-muted">công việc</span></p></div></div></div><div className="mt-6 rounded-xl bg-canvas p-3 text-xs leading-relaxed text-muted">{total ? `Bạn đã hoàn thành ${done} trên ${total} công việc. Tiếp tục giữ nhịp nhé!` : 'Chưa có công việc trong khoảng thời gian này. Hãy thêm task hoặc tạo dữ liệu mẫu để bắt đầu.'}</div></section>
            </div>
            <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-[#e0e9d9] bg-[#eaf0e5] p-5 sm:flex-row sm:items-center"><div><p className="text-sm font-bold">Muốn xem thống kê sống động hơn?</p><p className="mt-1 text-xs text-[#75816e]">Tạo 10 công việc mẫu để khám phá biểu đồ tuần.</p></div><button onClick={addMockData} className="self-start text-sm font-bold text-green underline underline-offset-4 hover:text-[#304d34] sm:self-auto">Thêm dữ liệu mẫu →</button></div>
          </main>
        )}

        <footer className="mt-14 flex flex-col justify-between gap-2 border-t border-line pt-5 text-[11px] text-muted sm:flex-row"><span>daymark. · Một ngày, từng việc một.</span><span>Dữ liệu được lưu cục bộ trên thiết bị của bạn.</span></footer>
      </div>
      {dialog && <TaskDialog task={dialog.task} onClose={() => setDialog(null)} onSave={saveTask} />}
      {toast && <div role="status" className="fade-in fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg">✓ &nbsp;{toast}</div>}
    </div>
  );
}

export default App;
