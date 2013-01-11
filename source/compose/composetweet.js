/*
	Copyright (c) 2010, Micah N Gorrell
	All rights reserved.

	THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
	WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
	EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
	WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
	OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
	ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
enyo.kind({

name:							"compose",
classes:						"compose",

events: {
	onCancel:					"",
	onSent:						""
},

published: {
	text:						""
},

components: [
	{
		name:					"txt",
		classes:				"txt",

		kind:					enyo.RichText,

		allowHtml:				false,
		defaultFocus:			true,

		onchange:				"change",
		onkeyup:				"change"
	},
	{
		name:					"counter",
		classes:				"counter"
	},

	{
		layoutKind:				"FittableColumnsLayout",
		components: [
			{
				kind:			onyx.Button,
				classes:		"button onyx-negative",
				content:		"Cancel",

				ontap:			"cancel"
			},
			{
				fit:			true
			},
			{
				kind:			onyx.Button,
				classes:		"button onyx-affirmative",
				content:		"Post Tweet",

				ontap:			"send"
			}
		]
	}
],

create: function()
{
	this.inherited(arguments);
	this.twitter = new TwitterAPI(this.user);

	this.$.txt.setContent('');
},

textChanged: function()
{
	this.$.txt.setContent(this.text);
},

rendered: function(sender, event)
{
	this.change();

	this.inherited(arguments);
},

change: function(sender, event)
{
	var node;

	if ((node = this.$.txt.hasNode())) {
		this.text = node.innerText.trim();
	} else {
		this.text = '';
	}

	this.$.counter.setContent(140 - this.text.length);
},

cancel: function(sender, event)
{
	this.doCancel({});
},

send: function(sender, event)
{
	var node;
	var value;

	if ((node = this.$.txt.hasNode())) {
		value = node.innerText.trim();
	} else {
		value = '';
	}

	// TODO	Add support for DMs, replies, etc

	/* Actually send it */
	this.twitter.sendTweet('update', function() {
		this.doSent({ text: value });
	}.bind(this), {
		status:		value
	});
}

});


