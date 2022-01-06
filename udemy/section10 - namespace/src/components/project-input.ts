/// <reference path="base.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../utils/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;

        constructor() {
            super("project-input", "app", "front", "user-input");
            this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector(
                "#description"
            )! as HTMLInputElement;
            this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
            this.configure();
        }

        configure() {
            // submitHandler 안의 this가 현재 이 클래스를 가리키도록 bind해주어야 한다. or 데코레이터 사용
            // this.element.addEventListener("submit", this.submitHandler.bind(this));
            this.element.addEventListener("submit", this.submitHandler);
        }

        renderContent(): void {}

        @Autobind
        private submitHandler(event: Event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                projectState.addProject({ title, desc, people });
            }
            this.clearInput();
        }

        private gatherUserInput(): [string, string, number] | void {
            const enteredTitle = this.titleInputElement.value;
            const enteredDesc = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;

            if (
                validate({ value: enteredTitle, required: true }) &&
                validate({ value: enteredDesc, required: true, minLength: 5 }) &&
                validate({ value: Number(enteredPeople), required: true, min: 1, max: 5 })
            ) {
                return [enteredTitle, enteredDesc, Number(enteredPeople)];
            } else {
                alert("Invalid Input, please fill out all input");
                return;
            }
        }

        private clearInput() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        }
    }
}
