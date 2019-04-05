$(document).ready(function() {
    $('body').css('height', $(window).height())
    $(window).resize(function () {
        $('body').css('height', $(window).height())
    });

    const app = new Clarifai.App({
        apiKey: 'd31b9af9b1e5462f9a78bcd47c827b38'
    });

    function getColors(file) {
        app.models.predict(Clarifai.COLOR_MODEL, { base64: file }).then(
            function (response) {
                const colors = response.outputs[0].data.colors
                colors.sort((a, b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0))

                const holder = $('#colors')
                holder.html('')

                for (let i = 0; i < colors.length; i++) {
                    const color = colors[i]

                    const addition = $.parseHTML(
                        '<div><span>' +
                        color.raw_hex + '</span><span>' +
                        color.w3c.name + '</span><span>' +
                        color.value + '</span></div>'
                    )[0]

                    $(addition).css('background-color', color.raw_hex)
                    if (tinycolor(color.raw_hex).isLight()) $(addition).css('color', 'black')

                    holder.append(addition)
                }
            },
            function (err) {
                console.error(err)
            }
        )
    }

    $('#upload').change(function () {
        const file = this.files[0]

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = function() {
            $('body').css('background-image', 'url("' + reader.result + '")')
            $('#colors').html('<h2>Processing...</h2>')

            getColors(reader.result.substr(reader.result.search('base64') + 7))
        }

        reader.onerror = function(err) {
            console.error('Error: ', err)
        }
    })
})