(async()=>{
    "use strict";

    // Dependencies
    const request = require("request-async")
    
    // Variables
    const args = process.argv.slice(2)
    
    // Functions
    async function getUserProfile(){
        const response = await request(`https://api.github.com/users/${args[0]}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/86.0.4240.183 Safari/537.36"
            }
        })
        return JSON.parse(response.body)
    }
    
    async function getUserOrgs(){
        const response = await request(`https://api.github.com/users/${args[0]}/orgs`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/86.0.4240.183 Safari/537.36"
            }
        })
        return JSON.parse(response.body)
    }
    
    async function getUserLeakedEmails(){
        const response = await request(`https://api.github.com/users/${args[0]}/events?per_page=100`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/86.0.4240.183 Safari/537.36"
            }
        })
        const emails = []

        for( const event of JSON.parse(response.body) ) if(event.payload.hasOwnProperty("commits")) if(!emails.includes(event.payload.commits[0].author.email)) emails.push(event.payload.commits[0].author.email)

        return emails
    }
    
    // Main
    if(!args.length) return console.log("usage: node index.js <username>")
    
    console.log("Doing some recon on the user, please wait...")
    const userProfile = await getUserProfile()
    const userOrgs = await getUserOrgs()
    const userLE = await getUserLeakedEmails()
    console.clear()

    console.log("Username:", args[0])
    console.log("Name:", userProfile.name)
    console.log("User ID:", userProfile.id)
    console.log("Avatar URL:", userProfile.avatar_url)
    console.log("Location:", userProfile.location)
    console.log("BIO:", userProfile.bio)
    if(userProfile.company) console.log("Company:", userProfile.company)
    console.log("Followers:", userProfile.followers)
    console.log("Following:", userProfile.following)
    console.log("Created At:", userProfile.created_at)
    console.log("Updated At:", userProfile.updated_at)
    if(userOrgs.length) console.log("Organizations:", userOrgs.map((d)=>d.login).join(", "))
    console.log("Leaked Emails:", userLE.join(", "))
})()