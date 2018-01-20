define(() => {
  var parseErrorType = {
    NO_BLOCKS: "NO_BLOCKS"
  };

  function arrayToString(arr) {
    return Array.from(arr).map(a => a.outerHTML).join("");
  }
  
  function parseAnswerPage(html) {
    var answers = [];
    $(html).filter("ol").children().each((index, value) => {
      answers.push($(value).text());
    });
    return {
      answers: answers
    };
  }

  function parseTestPage(html) {
    // TODO do this
  }

  function parseQuestionPage(html) {
    // Data is formatted as <h2 /><problem><h2 /><solution 1> [...] <h2 id="See_Also" /><stuff we don't want>.
    // So, the data is chunked into blocks delimited by h2s.
    
    // array of blocks
    var blocks = [];
    
    // the current block being built up
    var block = document.createElement("div");
    
    // We're done once we reach a "See_Also" id.
    var done = false;
    
    // Ignore the content before the first H2. (gets rid of the Table of Contents)
    var ignoreContent = true;
    
    // Does the current block have content?
    var contentInBlock = false;
    
    // For each element...
    $(html).each((index, value) => {
      // If we're done, do nothing.
      if (!done) {
        var $value = $(value);
        var tag = $value.prop("tagName");
        if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
          if (validateHeader(value.firstChild.id)) {
            // We're done if the id is "See_Also".
            done = value.id === "See_Also" || (value.firstChild !== null && value.firstChild.id === "See_Also");
            
            // If ignoring content, don't add a block.
            if (!ignoreContent) {
              // If content is in block, push the finished block onto the block array.
              // (This deals with an H2 followed by an H3.)
              if (block.children.length > 0) blocks.push(block.children);
              
              // Create a new block.
              block = document.createElement("div");
              contentInBlock = false;
            }
            
            // Not ignoring content anymore!
            ignoreContent = false;
          } else {
            // ignore this header and whatever's under it.
            ignoreContent = true;
          }
        } else if (value.className === "wikitable") {
          // This is the "see also" table -- stop!
          done = true;
        } else if (!ignoreContent && value.id !== "toc") {
          // Append the current element into the current block if...
          // content isn't being ignored
          // the id isn't #toc
          block.append(value);
          contentInBlock = true;
        }
      }
    });

    // Push the last block.
    if (block.children.length > 0) blocks.push(block.children);
    
    if (blocks.length === 0) {
      // No blocks ... ????
      throw {type: parseErrorType.NO_BLOCKS};
    }
    
    return {
      problem: arrayToString(blocks[0]),
      solutions: blocks.slice(1).map(a => arrayToString(a))
    };
  }

  function validateHeader(header) {
    return header !== undefined && (header.startsWith("Problem") || header.startsWith("Solution"));
  }

  return {
    parseAnswerPage: parseAnswerPage,
    parseErrorType: parseErrorType,
    parseQuestionPage: parseQuestionPage
  };
});