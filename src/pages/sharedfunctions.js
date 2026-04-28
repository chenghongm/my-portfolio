// utils/consoleEasterEgg.js

export function initConsoleEasterEgg() {

  if (typeof window === "undefined") return;

  const show = () => {
  
    // ASCII art - CH initials
    console.log(
      "%c" +
      "   ██████╗██╗  ██╗\n" +
      "  ██╔════╝██║  ██║\n" +
      "  ██║     ███████║\n" +
      "  ██║     ██╔══██║\n" +
      "  ╚██████╗██║  ██║\n" +
      "   ╚═════╝╚═╝  ╚═╝",
      "color: #00ff41; font-family: monospace;"
    );

    console.log(
      "%cHey, you found this. That means you're curious — mengchh01@gmail.com, Open to interesting problems..",
      "color: #aaaaaa; font-style: italic; font-size: 12px;"
    );

    console.log(
      "%c\" For I know the plans I have for you, declares the Lord,\n  plans to prosper you and not to harm you,\n  plans to give you hope and a future. \"\n\n                                    — Jeremiah 29:11",
      "color: #7ec8e3; font-style: italic; font-size: 12px; line-height: 1.8;"
    );

    console.log(
      "%c\" 耶和华说：我知道我向你们所怀的意念，是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。 \"\n\n                                    — 耶利米书 29:11",
      "color: #7ec8e3; font-style: italic; font-size: 12px; line-height: 1.8;"
    );
  };


  show(); // Show immediately on page load
}