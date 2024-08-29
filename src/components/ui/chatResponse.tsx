import { ResponseRenderer } from "@nlux/react";

export const ChatResponseRenderer: ResponseRenderer<string> = (props) => {
  const isAudio: boolean = props?.content?.[0]?.startsWith("audio:");
  const isImage: boolean = props?.content?.[0]?.startsWith("data:image/jpeg");
  // Approach 1: Grab the URL directly from the response.
  const audioUrl = isAudio ? props.content[0].replace("audio:", "") : "";
  // Approach 1: Get the URL from the blob.
  // const audioUrl = isAudio
  //   ? URL.createObjectURL(new Blob([props.content[0].replace("audio:", "")], { type: "audio/mpeg" }))
  //   : "";
  // Approach 3: Derive the URL by working with the encoded base64 string.
  // let audioUrl = "";
  //
  // if (isAudio) {
  //   // Assuming the audio data is base64 encoded
  //   const audioData = atob(props.content[0].replace("audio:", ""));
  //   const arrayBuffer = new ArrayBuffer(audioData.length);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //
  //   for (let i = 0; i < audioData.length; i++) {
  //     uint8Array[i] = audioData.charCodeAt(i);
  //   }
  //
  //   const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  //   audioUrl = URL.createObjectURL(blob);
  // }

  console.log(
    "ChatResponseRenderer -> isImage",
    isImage,
    "isAudio",
    isAudio,
    "audioUrl",
    audioUrl,
    "content",
    props?.content,
    "props",
    props,
  );

  return (
    <div className="response-renderer">
      {/* Option 1 — Use containerRef to render message using NLUX markdown parser: */}
      {/*<div className="response-container" ref={props.containerRef} />*/}

      {/* Or option 2 — Render the content array yourself: */}
      <div className="response-container">
        {isImage ? (
          // <Image unoptimized={true} src={decodeURIComponent(props.content[0])} alt={"Generated image"} />
          <img src={decodeURIComponent(props.content[0])} alt={"Generated image"} />
        ) : isAudio ? (
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" className="w-full" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          props.content
        )}
      </div>

      {/* Render extras */}
      {/*<div className="rating-container">*/}
      {/*  What do you think of this response? &nbsp;*/}
      {/*  <button onClick={() => console.log("I like it!")}>👍</button>*/}
      {/*  <button onClick={() => console.log("I love it!")}>❤️</button>*/}
      {/*  <button onClick={() => console.log("I hate it!")}>😵</button>*/}
      {/*</div>*/}
    </div>
  );
};
