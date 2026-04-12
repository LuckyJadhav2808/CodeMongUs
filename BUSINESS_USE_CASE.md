# Business & Target Audience Diagram (For Slide 1)

If you are using this diagram for your **Pitch / Problem Statement**, use this diagram! You can copy it into [Mermaid Live Editor](https://mermaid.live).

```mermaid
flowchart LR
    %% Actors
    Student[["🎓 Student"]]
    Instructor[["👨‍🏫 Instructor"]]
    Developer[["💻 Developer & Teams"]]
    Community[["🌍 Coding Community"]]

    %% Learning & Instruction Cluster
    subgraph Educational ["Learning & Instruction"]
        direction TB
        Learn(["Learn coding"])
        Practice(["Practice problems"])
        Teach(["Teach concepts"])
        Assign(["Assign tasks"])
        Guide(["Guide students"])
    end

    %% Development & Collaboration Cluster
    subgraph Professional ["Development & Collaboration"]
        direction TB
        Write(["Write code"])
        Debug(["Debug / fix issues"])
        Collab(["Collaborate in teams"])
    end

    %% Community Cluster
    subgraph Social ["Community & Knowledge"]
        direction TB
        Share(["Share knowledge"])
        Discuss(["Discuss problems"])
        Support(["Support users"])
    end

    %% Connections for Student & Instructor
    Student --> Learn
    Student --> Practice
    Student --> Collab

    Instructor --> Teach
    Instructor --> Assign
    Instructor --> Guide

    %% Connections for Developers
    Developer --> Write
    Developer --> Debug
    Developer --> Collab

    %% Connections for Community
    Community --> Share
    Community --> Discuss
    Community --> Support

    %% Styling
    classDef actor fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff,rx:5px,ry:5px;
    classDef usecase fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#0f172a;
    classDef box fill:none,stroke:#cbd5e1,stroke-width:2px,stroke-dasharray: 5 5;

    class Student,Instructor,Developer,Community actor;
    class Learn,Practice,Teach,Assign,Guide,Write,Debug,Collab,Share,Discuss,Support usecase;
    class Educational,Professional,Social box;
```
