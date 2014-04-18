var Hello = {
    connection: null,
    start_time: null,

    send_ping: function (to) {
        var ping = $iq({
            to: to,
            type: "get",
            id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});

        console.log("Sending ping to " + to + ".");
        console.log(ping.toString());

        Hello.start_time = (new Date()).getTime();
        Hello.connection.send(ping);
    },

    handle_pong: function (iq) {
        var elapsed = (new Date()).getTime() - Hello.start_time;
        console.log("Received pong from server in " + elapsed + "ms.");
        console.log(iq.toString());
        console.log(iq.outerHTML);

        Hello.connection.disconnect();

        return false;
    }
};

$(document).ready(function () {
    $('#login_dialog').dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        title: 'Connect to XMPP',
        buttons: {
            "Connect": function () {
                $(document).trigger('connect', {
                    jid: $('#jid').val().toLowerCase(),
                    password: $('#password').val()
                });
                
                $('#password').val('');
                $(this).dialog('close');
            }
        }
    });
});

$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(
        "http://bosh.metajack.im:5280/xmpp-httpbind");

    conn.connect(data.jid, data.password, function (status) {
        console.log(status);
        if (status === Strophe.Status.CONNECTED) {
            $(document).trigger('connected');
            console.log('connected');
        } else if (status === Strophe.Status.DISCONNECTED) {
            $(document).trigger('disconnected');
            console.log('disconnected');
        }
    });

    Hello.connection = conn;
});

$(document).bind('connected', function () {
    // inform the user
    console.log("Connection established.");

    Hello.connection.addHandler(Hello.handle_pong, null, "iq", null, "ping1");

    var domain = Strophe.getDomainFromJid(Hello.connection.jid);
    
    Hello.send_ping(domain);

});

$(document).bind('disconnected', function () {
    console.log("Connection terminated.");

    // remove dead connection object
    Hello.connection = null;
});

(function () {
    var pres1 = new Strophe.Builder('presence');
    var pres2 = new Strophe.Builder('presence', {to: 'example.com'});
    console.log(pres1, pres2);
    var pres1 = $build('presence');
    var pres2 = $build('presence', {to: 'example.com'});
    var pres3 = $pres();
    var pres4 = $pres({to: 'example.com'});
    console.log(pres1, pres2,pres3,pres4);
    var stanza = $build('foo').c('bar').c('baz');
    console.log(stanza.toString());
    var message = $msg({to: 'darcy@pemberley.lit', type: 'chat'}) .c('body').t('How do you do?');
    console.log(message.toString());
    var iq = $iq({to: 'pemberley.lit', type: 'get', id: 'disco1'}) .c('query', {xmlns: 'http://jabber.org/protocol/disco#info'});
    console.log(iq.toString());
    var presence = $pres().c('show').t('away').up() .c('status').t('Off to Meryton');
    console.log(presence.toString());
})()