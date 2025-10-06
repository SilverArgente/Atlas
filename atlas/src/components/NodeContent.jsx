import React, { createContext } from 'react';

export default function NodeContent({title, content}) {
    const [showContent, setShowContent] = React.useState(true);
    const [contentText, setContentText] = React.useState(content); // Why do I have to add code to make basic HTML features work as intended in React?
    const [titleText, setTitleText] = React.useState(title);
    return (
        <span hidden id="node-content-bubble" class="node-content">
            <div>
                <h1>Edit content for: <strong onClick={()=>{alert("Please use the Node inspector in the toolbar to edit this (for now.)")}} id="node-content-title">{titleText}</strong></h1>
                <textarea id="node-content-text" onChange={(e)=>{setContentText(e.target.value)}} name="nodeContentBox" rows="13" cols="35" placeholder="Enter node content..." value={contentText}></textarea>
                <button onClick={()=>{document.getElementById("node-content-bubble").hidden = true}} style={{position: 'absolute', top: '5pt'}}>X</button>
            </div>
        </span>
    );
}