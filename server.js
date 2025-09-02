// GET коментарі
app.get("/comments", async (req,res)=>{
  try {
    const resp = await fetch(`https://api.github.com/repos/${REPO}/contents/comments.json`, {
      headers:{Authorization:`token ${GITHUB_TOKEN}`}
    });
    const data = await resp.json();
    let content=[];
    if(data.content) content = JSON.parse(Buffer.from(data.content,"base64").toString());
    res.json(content);
  } catch(err){console.error(err); res.status(500).send("Error");}
});

// POST додати коментар
app.post("/add-comment", async(req,res)=>{
  const {articleIndex, comment, user} = req.body;
  if(!comment || !user) return res.status(400).send("No comment");
  try{
    const getResp = await fetch(`https://api.github.com/repos/${REPO}/contents/comments.json`, {
      headers:{Authorization:`token ${GITHUB_TOKEN}`}
    });
    const data = await getResp.json();
    let content=[];
    if(data.content) content = JSON.parse(Buffer.from(data.content,"base64").toString());
    if(!content[articleIndex]) content[articleIndex]=[];
    content[articleIndex].push({user,comment,date:new Date().toISOString()});

    await fetch(`https://api.github.com/repos/${REPO}/contents/comments.json`,{
      method:"PUT",
      headers:{Authorization:`token ${GITHUB_TOKEN}`},
      body:JSON.stringify({
        message:"Add comment",
        content:Buffer.from(JSON.stringify(content,null,2)).toString("base64"),
        sha:data.sha,
        branch:BRANCH
      })
    });
    res.send("Comment added!");
  } catch(err){console.error(err); res.status(500).send("Error");}
});
