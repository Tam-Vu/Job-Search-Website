/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"

function randomID(len: number) {
  let result = ""
  if (result) return result
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i
  len = len || 5
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return result
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1]
  return new URLSearchParams(urlStr)
}

export default function VideoCall() {
  const roomID = getUrlParams().get("roomID") || "12345"
  const myMeeting = async (element: any) => {
    // generate Kit Token
    const appID = 2036844355
    const serverSecret = "e7b75ecd417cc7ea8d82939dc666d724"
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5))

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken)
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url: window.location.protocol + "//" + window.location.host + window.location.pathname + "?roomID=" + roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    })
  }

  return <div className="myCallContainer" ref={myMeeting} style={{ width: "100vw", height: "100vh" }}></div>
}
