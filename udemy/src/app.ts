enum ProjectStatus {
    ACTIVE = "active",
    FINISHED = "finished",
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener = (projects: Project[]) => void;

class ProjectState {
    private projects: Project[] = [];
    private listeners: Listener[] = [];
    private static instance: ProjectState;

    private constructor() {}

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(project: { title: string; desc: string; people: number }) {
        const newProj = new Project(
            Math.random().toString(),
            project.title,
            project.desc,
            project.people,
            ProjectStatus.ACTIVE
        );
        this.projects.push(newProj);
        this.notify();
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    notify() {
        for (const listener of this.listeners) {
            listener(this.projects.slice()); // 리스너가 프로젝트배열을 조작하지 못하도록 카피본을 넘겨준다.
        }
    }
}

const projectState = ProjectState.getInstance();

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(input: Validatable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.maxLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.min != null && typeof input.value === "number") {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === "number") {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}

function Autobind(
    _: any, // target
    _2: string, // methodName
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild! as HTMLFormElement;
        this.formElement.id = "user-input";

        this.titleInputElement = this.formElement.querySelector("#title")! as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector(
            "#description"
        )! as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector("#people")! as HTMLInputElement;

        this.configure();
        this.attachToHostElement(this.formElement);
    }

    private configure() {
        // submitHandler 안의 this가 현재 이 클래스를 가리키도록 bind해주어야 한다. or 데코레이터 사용
        // this.formElement.addEventListener("submit", this.submitHandler.bind(this));
        this.formElement.addEventListener("submit", this.submitHandler);
    }

    private attachToHostElement(element: Element) {
        this.hostElement.insertAdjacentElement("afterbegin", element);
    }

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

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;
    // assignedProjects: Project[];

    // 생성자로 받은 type을 바로 멤버변수로 만든다.
    constructor(private projectType: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.sectionElement = importedNode.firstElementChild as HTMLElement;
        this.sectionElement.id = `${this.projectType}-projects`;

        // this.assignedProjects = [];
        projectState.addListener(this.renderProjects);
        this.renderSectionTitle();
        this.attachToHostElement(this.sectionElement);
    }

    @Autobind
    private renderProjects(projects: Project[]) {
        const listEl = document.getElementById(
            `${this.projectType}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const projItem of projects) {
            if (projItem.status === this.projectType) {
                const li = document.createElement("li");
                li.textContent = projItem.title;
                listEl.appendChild(li);
            }
        }
    }

    private renderSectionTitle() {
        const listId = `${this.projectType}-projects-list`;
        this.sectionElement.querySelector("ul")!.id = listId;
        this.sectionElement.querySelector("h2")!.textContent =
            this.projectType.toUpperCase() + " PROJECTS";
    }

    private attachToHostElement(element: Element) {
        this.hostElement.insertAdjacentElement("beforeend", element);
    }
}

const pInput = new ProjectInput();
const activePList = new ProjectList("active");
const finishedPList = new ProjectList("finished");
