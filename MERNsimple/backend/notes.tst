cors issue-
wen using api in backend, requst frm browser becoz of security reason its blocked.
They think frnt end se req on some other domain, backend is on other domain

-//save ya send ke liye 'post' route use karte h
-jab data get karte h database se tb 'get' route

JWT- if proj live, anyone can use our api in dere proj or steal the data, so we use token accessibilty
,so apis ll return data only wen dey get token.token frm users. Users get token frm login nd signup wid password.
those api get token we ll get d data, otherwise tkn gets expired ,wont get data.
Dose login nd register api send token in other apis, after addin tokn to login nd register api(aftr we do login nd registr).

#2  verify JWT- after genratin token in login/register api, now wen sendin token to other api,say prdt api, only dat user shld get data
dat have dose token frm login api(then user is said to be authenticated). After sendin token to 'prdt api', it has to be verified in backend.token is ok or not