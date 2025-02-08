/**
 * @name BreakBuddy
 * @description Reminds you to take breaks and stretch at customizable intervals.
 * @author AidanTheDev
 * @version 1.0.0
 * @authorId 497200251661320212
 * @website https://github.com/Aidan-The-Dev/BreakBuddy
 * @source https://github.com/Aidan-The-Dev/BreakBuddy/blob/main/BreakBuddy.plugin.js
 */

module.exports = (() => {
    const config = {
        info: {
            name: "BreakBuddy",
            authors: [{ name: "AidanTheDev" }],
            version: "1.0.0",
            description: "Reminds you to take breaks and stretch at customizable intervals."
        }
    };

    return class BreakBuddy {
        constructor() {
            this.defaultInterval = 30; // Default reminder interval in minutes
            this.isReminderActive = false; // To prevent spam
        }

        start() {
            this.loadSettings();
            this.scheduleReminder();
        }

        stop() {
            clearInterval(this.reminderInterval);
        }

        loadSettings() {
            this.interval = BdApi.loadData(config.info.name, "interval") || this.defaultInterval;
            console.log(`Reminder interval is set to: ${this.interval} minutes`);
            this.scheduleReminder();
        }

        saveSettings(newInterval) {
            BdApi.saveData(config.info.name, "interval", newInterval);
            BdApi.Plugins.reload("BreakBuddy"); // Reload plugin to apply changes
        }

        scheduleReminder() {
            clearInterval(this.reminderInterval);
            this.isReminderActive = false;
            this.reminderInterval = setInterval(() => {
                if (!this.isReminderActive) {
                    this.showReminder();
                    this.isReminderActive = true;
                }
            }, this.interval * 60000);
        }

        showReminder() {
            const background = document.createElement("div");
            background.style.position = "absolute";
            background.style.top = "0";
            background.style.left = "0";
            background.style.width = "100%";
            background.style.height = "100%";
            background.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            background.style.zIndex = "9998";
            document.body.appendChild(background);

            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            modal.style.backgroundColor = "#2d2f3d";
            modal.style.color = "white";
            modal.style.padding = "30px 40px";
            modal.style.borderRadius = "15px";
            modal.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.4)";
            modal.style.zIndex = "9999";
            modal.style.maxWidth = "420px";
            modal.style.textAlign = "center";

            const message = document.createElement("p");
            message.textContent = "⏰ Time to stretch! Take a quick break.";
            modal.appendChild(message);

            const okButton = document.createElement("button");
            okButton.textContent = "Got it!";
            okButton.style.marginTop = "15px";
            okButton.style.backgroundColor = "#4CAF50";
            okButton.style.border = "none";
            okButton.style.color = "white";
            okButton.style.padding = "12px 25px";
            okButton.style.borderRadius = "8px";
            okButton.style.cursor = "pointer";
            okButton.addEventListener("click", () => {
                modal.remove();
                background.remove();
                this.isReminderActive = false;
            });
            modal.appendChild(okButton);
            document.body.appendChild(modal);
        }

        getSettingsPanel() {
            const panel = document.createElement("div");
            panel.style.padding = "15px";
            panel.style.display = "flex";
            panel.style.flexDirection = "column";
            panel.style.gap = "10px";
            panel.style.color = "var(--text-normal)";
            panel.style.background = "var(--background-secondary)";
            panel.style.borderRadius = "8px";

            const title = document.createElement("h2");
            title.textContent = "Interval Adjustment";
            panel.appendChild(title);

            const label = document.createElement("label");
            label.textContent = "Reminder Interval (minutes):";
            panel.appendChild(label);

            const sliderContainer = document.createElement("div");
            sliderContainer.style.display = "flex";
            sliderContainer.style.alignItems = "center";
            sliderContainer.style.gap = "10px";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "5";
            slider.max = "120";
            slider.step = "5";
            slider.value = BdApi.loadData("BreakBuddy", "interval") || this.defaultInterval;
            slider.style.flexGrow = "1";
            sliderContainer.appendChild(slider);

            const sliderValue = document.createElement("span");
            sliderValue.textContent = `${slider.value} min`;
            sliderContainer.appendChild(sliderValue);

            slider.addEventListener("input", () => {
                sliderValue.textContent = `${slider.value} min`;
            });

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.style.marginTop = "10px";
            saveButton.style.padding = "10px";
            saveButton.style.backgroundColor = "#5865F2";
            saveButton.style.color = "white";
            saveButton.style.border = "none";
            saveButton.style.borderRadius = "5px";
            saveButton.style.cursor = "pointer";

            saveButton.addEventListener("click", () => {
                this.saveSettings(slider.value);
                saveButton.textContent = "Saved!";
                setTimeout(() => saveButton.textContent = "Save", 1500);
            });

            panel.appendChild(sliderContainer);
            panel.appendChild(saveButton);
            return panel;
        }
    };
})();