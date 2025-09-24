// Display utils for sandbox mode (creating a concept map)




/*
function drawConnection(fromX, fromY, toX, toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        const midY = (fromY + toY) / 2;
        ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
        
        const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(1, '#357ABD');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
}

function drawNode(x, y, title) {
    ctx.save();
    
    // Draw shadow and circle
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#4A90E2";
    ctx.fill();
    
    // Draw border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = "#357ABD";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = "black";
    ctx.font = "bold 14px Arial";
    const textWidth = ctx.measureText(title).width;
    ctx.fillText(title, x - textWidth / 2, y + 5);

    // Draw expand/collapse indicator
    if (concept_hierarchy && getNodeByTitle(title)?.children.length > 0) {
        const isExpanded = expandedNodes.has(title);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        const angle = Math.PI / 6;
        const distance = 35;
        ctx.fillText(isExpanded ? "-" : "+", 
            x + distance * Math.cos(angle), 
            y - distance * Math.sin(angle));
    }
    
    ctx.restore();
}

*/