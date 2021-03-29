(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.quarterSelect = factory());
}(this, (function () { 'use strict';

  function getEventTarget(event) {
      try {
          if (typeof event.composedPath === "function") {
              var path = event.composedPath();
              return path[0];
          }
          return event.target;
      }
      catch (error) {
          return event.target;
      }
  }

  function quarterSelectPlugin() {
      return function (fp) {
          function onDayHover(event) {
              var day = getEventTarget(event);
              if (!day.classList.contains("flatpickr-day"))
                  return;
              var days = fp.days.childNodes;
              var dateObj = day.dateObj;
              var quarter = Math.floor(dateObj.getMonth() / 3);
              var quarterStartDay = new Date(dateObj.getFullYear(), quarter * 3, 1);
              var quarterEndDay = new Date(quarterStartDay.getFullYear(), quarterStartDay.getMonth() + 3, 0);
              for (var i = days.length; i--;) {
                  var day_1 = days[i];
                  var date = day_1.dateObj;
                  if (date > quarterEndDay || date < quarterStartDay)
                      day_1.classList.remove("inRange");
                  else
                      day_1.classList.add("inRange");
              }
          }
          function highlightQuarter() {
              var selDate = fp.latestSelectedDateObj;
              if (selDate !== undefined &&
                  selDate.getMonth() === fp.currentMonth &&
                  selDate.getFullYear() === fp.currentYear) {
                  var quarter = Math.floor(selDate.getMonth() / 3);
                  fp.quarterStartDay = new Date(selDate.getFullYear(), quarter * 3, 1);
                  fp.quarterEndDay = new Date(fp.quarterStartDay.getFullYear(), fp.quarterStartDay.getMonth() + 3, 0);
              }
              var days = fp.days.childNodes;
              for (var i = days.length; i--;) {
                  var date = days[i].dateObj;
                  if (date >= fp.quarterStartDay && date <= fp.quarterEndDay)
                      days[i].classList.add("quarter", "selected");
              }
          }
          function clearHover() {
              var days = fp.days.childNodes;
              for (var i = days.length; i--;)
                  days[i].classList.remove("inRange");
          }
          function onReady() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.addEventListener("mouseover", onDayHover);
          }
          function onDestroy() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.removeEventListener("mouseover", onDayHover);
          }
          return {
              onValueUpdate: highlightQuarter,
              onMonthChange: highlightQuarter,
              onYearChange: highlightQuarter,
              onOpen: highlightQuarter,
              onClose: clearHover,
              onParseConfig: function () {
                  fp.config.mode = "single";
                  fp.config.enableTime = false;
                  fp.config.dateFormat = fp.config.dateFormat
                      ? fp.config.dateFormat
                      : "\\W\\e\\e\\k #W, Y";
                  fp.config.altFormat = fp.config.altFormat
                      ? fp.config.altFormat
                      : "\\W\\e\\e\\k #W, Y";
              },
              onReady: [
                  onReady,
                  highlightQuarter,
                  function () {
                      fp.loadedPlugins.push("quarterSelect");
                  },
              ],
              onDestroy: onDestroy,
          };
      };
  }

  return quarterSelectPlugin;

})));
//# sourceMappingURL=quarterSelect.js.map
