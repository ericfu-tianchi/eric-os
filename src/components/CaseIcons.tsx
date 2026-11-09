/** Line icons for the Huawei page: 1.5px ink strokes with one part in the page's accent. */
const ICONS = {
  paas: <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5 8.6 10.1M20 7.5l-4.6 2.6M12 21v-5.1" /><circle className="f" cx="12" cy="12" r="1.6" /></>,
  orchestration: <><circle cx="12" cy="3.75" r="1.75" /><circle cx="20.25" cy="12" r="1.75" /><circle cx="12" cy="20.25" r="1.75" /><circle cx="3.75" cy="12" r="1.75" /><path d="M12 5.5v2.7M12 18.5v-2.7M18.5 12h-2.7M5.5 12h2.7" /><circle className="f" cx="12" cy="12" r="2" /></>,
  saas: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18" /><path className="f" d="M12 11.2c.35 1.75 1.25 2.65 3 3-1.75.35-2.65 1.25-3 3-.35-1.75-1.25-2.65-3-3 1.75-.35 2.65-1.25 3-3z" /></>,
  data: <><ellipse cx="10" cy="5.5" rx="7" ry="2.5" /><path d="M3 5.5v10c0 1.4 3.1 2.5 7 2.5M17 5.5V10" /><path className="a" d="M13 12h8l-3 4v4l-2-1v-3z" /></>,
  training: <><circle cx="12" cy="12" r="9" /><path className="a" d="M12 12l4-4" /><path d="M12 5v1.5M5 12h1.5M19 12h-1.5" /></>,
  evaluation: <><circle cx="12" cy="9" r="6" /><path d="M8 14l-2 7 6-3 6 3-2-7" /><path className="a" d="M9.5 11V9M12 11V7M14.5 11V8.5" /></>,
  playground: <><path d="M4 5h16v12H9l-5 4z" /><path className="a" d="M10 8l5 3-5 3z" /></>,
  prompt: <><path d="M12.5 21H5V3h9l4 4v3.5M8 10h7M8 14h4" /><path className="a" d="M15 21.5l.7-2.8 4.6-4.6 2.1 2.1-4.6 4.6z" /></>,
  maker: <><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4" /><circle className="a" cx="12" cy="3.5" r="1" /><path className="a" d="M9 13v1.5M15 13v1.5" /></>,
  bi: <><path d="M5 20V11M11 20V6M17 20v-6" /><path className="a" d="M3 21h18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path className="a" d="M16.5 16.5 21 21" /><path d="M8 9h6M8 12h4" /></>,
};
export type CaseIconName = keyof typeof ICONS;
export const CaseIcon = ({ name }: { name: CaseIconName }) => <svg className="cs-icon" viewBox="0 0 24 24" aria-hidden>{ICONS[name]}</svg>;
