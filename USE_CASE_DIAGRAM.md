# CodeMongUs — Core Gameplay Use Case Diagram

Here is a perfectly structured UML Use Case diagram for your project. You can copy the code below into any Mermaid visualizer (like [Mermaid Live Editor](https://mermaid.live/)) to instantly generate an image for your PowerPoint, or just take a screenshot of it here if your markdown viewer supports it!

```mermaid
flowchart LR
    %% Defining Actors with a little styling
    Host[["👑 Game Host"]]
    Crewmate[["👨‍🚀 Crewmate"]]
    Impostor[["👽 Impostor"]]

    %% Defining the System Boundary
    subgraph CodeMongUs ["CodeMongUs Game Engine"]
        direction TB
        
        %% Lobby Phase Use Cases
        CreateRoom(["Create Game Room"])
        ConfigSettings(["Configure Language & Phase Timers"])
        StartGame(["Start Game"])

        %% Coding Phase Use Cases
        WriteCode(["Collaboratively Write Code"])
        LiveChat(["Communicate in Live Chat"])
        CommitCode(["Propose Final Code Commit"])
        
        %% Impostor Specific Use Cases
        Sabotage(["Trigger Code Sabotage (Scramble/Blind)"])
        FakeTask(["Fake Coding Activity"])

        %% Voting Phase Use Cases
        ReportBug(["Hit Report Bug (Call Emergency Meeting)"])
        VoteEject(["Vote to Eject Suspected Impostor"])
    end

    %% Host Relationships
    Host ---> CreateRoom
    Host ---> ConfigSettings
    Host ---> StartGame

    %% Crewmate Relationships
    Crewmate ---> WriteCode
    Crewmate ---> LiveChat
    Crewmate ---> CommitCode
    Crewmate ---> ReportBug
    Crewmate ---> VoteEject

    %% Impostor Relationships
    Impostor ---> WriteCode
    Impostor ---> LiveChat
    Impostor ---> FakeTask
    Impostor ---> Sabotage
    Impostor ---> VoteEject
    
    %% Styling to make it look professional
    classDef actor fill:#2d3748,stroke:#cbd5e1,stroke-width:2px,color:#fff,rx:5px,ry:5px;
    classDef usecase fill:#e2e8f0,stroke:#64748b,stroke-width:2px,color:#0f172a;
    classDef system fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,stroke-dasharray: 5 5;
    
    class Host,Crewmate,Impostor actor;
    class CreateRoom,ConfigSettings,StartGame,WriteCode,LiveChat,CommitCode,Sabotage,FakeTask,ReportBug,VoteEject usecase;
    class CodeMongUs system;
```

### Explaining this diagram to the Judges:
1. **The System Boundary (The dotted box):** Represents the entire CodeMongUs gameplay engine.
2. **The Actors (Dark rectangles on the left):** Shows the three distinct roles a user can hold during the game.
3. **The Use Cases (Light gray ovals):** Defines every core action available. It cleanly demonstrates that while both Crewmates and Impostors share basic features (writing code, chatting, voting), the Impostor has exclusive, dangerous permissions (Sabotage) and the Host has administrative control prior to launch.
