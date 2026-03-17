const supabaseUrl = "https://kkhwmimzavaspczqlduo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraHdtaW16YXZhc3BjenFsZHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjUxMzksImV4cCI6MjA4OTI0MTEzOX0.r_W7RByAAofZOzeAse6Z9iKY6XqY6LW0qLHVcLpBV5k";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);


// LOGIN
const loginForm = document.getElementById("login-form");

if (loginForm) {

loginForm.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const { data, error } = await supabaseClient.auth.signInWithPassword({
email,
password
});

if (error) {
document.getElementById("message").innerText = error.message;
return;
}

const { data: profile, error: profileError } = await supabaseClient
  .from("profiles")
  .select("role")
  .eq("id", data.user.id)
  .single();

if(profileError || !profile){
  alert("Unable to fetch profile. Access denied.");
  return;
}

if(profile.role !== "admin"){
  alert("Access denied");
  return;
}

window.location.href = "dashboard.html";

});
}



// DASHBOARD
const table = document.getElementById("requests-table");

if (table) {
loadRequests();
}

async function loadRequests() {

const { data } = await supabaseClient
.from("internet_requests")
.select("*")
.order("created_at", { ascending: false });

data.forEach(request => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${request.name}</td>
<td>
${request.phone}
<button onclick="copyPhone('${request.phone}')">Copy</button>
</td>
<td>${request.location}</td>
<td>${request.plan}</td>
<td>${request.status}</td>
<td>
<button onclick="markServiced('${request.id}')">Mark Serviced</button>
</td>
`;

table.appendChild(row);

});

}

async function markServiced(id){

await supabaseClient
.from("internet_requests")
.update({status:"serviced"})
.eq("id", id)

location.reload()

}

function copyPhone(phone){

navigator.clipboard.writeText(phone);

alert("Phone number copied: " + phone);

}
