$(function() {
    var INDEX = 0;

    $("#chat-submit").click(function(e) {
        e.preventDefault();
        sendMessage();
    });

    $("#chat-input").keydown(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        var msg = $("#chat-input").val().trim();
        if (msg === '') {
            return false;
        }
        generate_message(msg, 'self');
        fetchChatbotResponse(msg);
    }

function generate_message(msg, type) {
    INDEX++;
    var str = "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
    if (type === 'user') {
        str += "   <span class=\"msg-avatar\">";
        str += "       <img src=\"./resources/bot-icon.png\" alt=\"InteraktBot Icon\">";
        str += "   </span>";
    }
    str += "   <div class=\"cm-msg-text\">";

    msg = msg.replace(/(nom|e-mail)/gi, '<span style="font-weight: bold; color: green; text-decoration: underline;">$1</span>');
    str += msg;
    str += "   </div>";
    str += "</div>";

    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX).hide().fadeIn(300);

    if (type == 'self') {
        $("#chat-input").val('');
    }

    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
}
    async function fetchChatbotResponse(msg) {
        await fetch("http://localhost:8000/predict/?input_text=" + encodeURIComponent(msg), {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then((res) => {
            console.log('Received chatbot response:', res);
            generate_message(res.result, 'user');
        }).catch(error => {
            console.error('Error fetching chatbot response:', error);
            generate_message('Sorry, something went wrong. Please try again later.', 'user');
        });
    }

    $(document).delegate(".chat-btn", "click", function() {
        var value = $(this).attr("chat-value");

        generate_message(value, 'self');

        fetchChatbotResponse(value);

        $(".chat-btn").hide();

        $(".chat-box").addClass("collapsed");

        $(".chat-input input").show();

        $("#chat-submit").show();
    });

    $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    });

    $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    });
});
