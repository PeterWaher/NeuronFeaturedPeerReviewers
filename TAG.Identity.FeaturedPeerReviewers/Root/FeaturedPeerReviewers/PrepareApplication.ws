﻿if !exists(QuickLoginUser) then BadRequest("You need to scan code first.");
if QuickLoginUser.State != Waher.Networking.XMPP.Contracts.IdentityState.Approved then BadRequest("Identity not approved.");
if QuickLoginUser.From>Now then BadRequest("Identity will only be valid for use after "+Str(QuickLoginUser.From));
if QuickLoginUser.To<Now then BadRequest("Identity is not valid for use after "+Str(QuickLoginUser.To));

Application:=select top 1 * from TAG.Identity.FeaturedPeerReviewers.FeaturedPeerReviewer where LegalId=QuickLoginUser.Id;
if exists(Application) then
	SeeOther("Remove.md");

Application:=Create(TAG.Identity.FeaturedPeerReviewers.FeaturedPeerReviewer);
Application.LegalId:=QuickLoginUser.Id;
Application.Provider:=QuickLoginUser.Provider;
Application.State:=QuickLoginUser.State;
Application.Created:=QuickLoginUser.Created;
Application.Updated:=QuickLoginUser.Updated;
Application.From:=QuickLoginUser.From;
Application.To:=QuickLoginUser.To;
Application.ApprovedForPublication:=false;
Application.FullName:=QuickLoginUser.UserName;
Application.Country:=(QuickLoginUser.Properties.COUNTRY ??? "");
Application.Region:=(QuickLoginUser.Properties.REGION ??? "");
Application.City:=(QuickLoginUser.Properties.CITY ??? "");
Application.Area:=(QuickLoginUser.Properties.AREA ??? "");
Application.Zip:=(QuickLoginUser.Properties.ZIP ??? "");
Application.Address:=(QuickLoginUser.Properties.ADDR ??? "");
Application.EMail:=(QuickLoginUser.Properties.EMAIL ??? "");
Application.PhoneNumber:=(QuickLoginUser.Properties.PHONE ??? "");
Application.Jid:=(QuickLoginUser.Properties.JID ??? "");

AvatarUrl:=Waher.IoTGateway.Gateway.GetUrl(QuickLoginUser.AvatarUrl)+"?Width=128&Height=128";
Avatar:=Get(AvatarUrl);

FileName:="";
PhotoUrl:="/FeaturedPeerReviewers/Images/"+QuickLoginUser.Id+".webp";
if !Gateway.HttpServer.TryGetFileName(PhotoUrl,false,FileName) then
	ServiceUnavailable("Unable to save photo.");

Folder:=System.IO.Path.GetDirectoryName(FileName);
if !System.IO.Directory.Exists(Folder) then
	System.IO.Directory.Create(Folder);

Application.PhotoFileName:=FileName;
Application.PhotoContentType:=SaveFile(Avatar,FileName);
Application.PhotoWidth:=Avatar.Width;
Application.PhotoHeight:=Avatar.Height;

SaveNewObject(Application);

{
	"legalId": Application.LegalId,
	"provider": Application.Provider,
	"state": Application.State,
	"created": Application.Created,
	"updated": Application.Updated,
	"from": Application.From,
	"to": Application.To,
	"approvedForPublication": Application.ApprovedForPublication,
	"fullName": Application.FullName,
	"country": Application.Country,
	"region": Application.Region,
	"city": Application.City,
	"area": Application.Area,
	"zip": Application.Zip,
	"address": Application.Address,
	"eMail": Application.EMail,
	"phoneNumber": Application.PhoneNumber,
	"jid": Application.Jid,
	"photo": PhotoUrl,
	"photoContentType": Application.PhotoContentType,
	"photoWidth": Application.PhotoWidth,
	"photoHeight": Application.PhotoHeight
}