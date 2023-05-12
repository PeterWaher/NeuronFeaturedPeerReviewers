﻿function OpenPage(Url)
{
	window.open(Url, "_blank");
}

function Accept(LegalId)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function ()
	{
		if (xhttp.readyState === 4)
		{
			if (xhttp.status === 200)
			{
				RemoveApplication(LegalId);
				AddFeaturedReviewer(JSON.parse(xhttp.responseText));
			}
			else
				window.alert(xhttp.responseText);

			delete xhttp;
		}
	};

	xhttp.open("POST", "Accept.ws", true);
	xhttp.setRequestHeader("Content-Type", "text/plain");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(LegalId);
}

function Delete(LegalId)
{
	if (!window.confirm("Are you sure you want to delete the featured reviewer?"))
		return;

	Reject(LegalId);
}

function Reject(LegalId)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function ()
	{
		if (xhttp.readyState === 4)
		{
			if (xhttp.status === 200)
				RemoveApplication(LegalId);
			else
				window.alert(xhttp.responseText);

			delete xhttp;
		}
	};

	xhttp.open("POST", "Reject.ws", true);
	xhttp.setRequestHeader("Content-Type", "text/plain");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(LegalId);
}

function RemoveApplication(LegalId)
{
	var Tr = document.getElementById(LegalId + "_1");
	Tr.parentElement.removeChild(Tr);

	Tr = document.getElementById(LegalId + "_2");
	Tr.parentElement.removeChild(Tr);
}

function AddFeaturedReviewer(Reviewer)
{
	var TBody = document.getElementById("FeaturedReviewers");

	var Tr = document.createElement("TR");
	Tr.setAttribute("id", Reviewer.legalId + "_1");
	TBody.appendChild(Tr);

	var Td = document.createElement("TD");
	Td.setAttribute("rowspan", "2");
	Td.innerHTML = "<img src='/FeaturedPeerReviewers/Images/" + Reviewer.legalId + ".webp' alt='Photo' width='" +
		Reviewer.photoWidth + "' height='" + Reviewer.photoHeight + "' />";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.setAttribute("colspan", "5");
	Td.innerHTML = "<a href='/ValidateLegalId.md?ID=" + Reviewer.legalId + "&Purpose=Reviewing%20application' target='_blank'><code>" +
		Reviewer.legalId+"</code></a>";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.setAttribute("colspan", "2");
	Td.innerText = Reviewer.fullName;
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.setAttribute("colspan", "2");
	Td.innerText = Reviewer.description;
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Tr.appendChild(Td);

	Tr = document.createElement("TR");
	Tr.setAttribute("id", Reviewer.legalId + "_2");
	TBody.appendChild(Tr);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.state;
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.from;
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.to;
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useCountry ? Reviewer.country : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useRegion ? Reviewer.region : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useCity ? Reviewer.city : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useArea ? Reviewer.area : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useZip ? Reviewer.zip : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Td.innerText = Reviewer.useAddress ? Reviewer.address : "*";
	Tr.appendChild(Td);

	Td = document.createElement("TD");
	Tr.appendChild(Td);

	var Button = document.createElement("BUTTON");
	Button.className = "negButton";
	Button.innerText = "Delete";
	Button.setAttribute("type", "button");
	Button.setAttribute("onclick", "Delete('" + Reviewer.legalId + "')");
	Td.appendChild(Button);
}