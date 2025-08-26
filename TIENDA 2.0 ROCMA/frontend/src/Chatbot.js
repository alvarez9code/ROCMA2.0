import React from 'react';

// Reemplaza 'YOUR_DIRECT_LINE_SECRET' por tu clave de Microsoft Bot Framework
const directLineSecret = 'CNE2AELGMgfrEEOGYc5YKoe8obKBP1CQZvfgWF8Uf0DeJCGmTMv9JQQJ99BHAC3pKaRAArohAAABAZBSEVQk';

function Chatbot() {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js';
    script.async = true;
    script.onload = () => {
      window.WebChat.renderWebChat({
        directLine: window.WebChat.createDirectLine({ secret: directLineSecret })
      }, document.getElementById('webchat'));
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 w-80 h-96 flex flex-col">
        <div className="font-bold text-yellow-600 mb-2 text-center">Chat ROCMA</div>
        <div id="webchat" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default Chatbot;
