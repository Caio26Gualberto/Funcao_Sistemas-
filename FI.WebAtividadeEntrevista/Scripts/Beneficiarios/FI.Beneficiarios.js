$(document).ready(function () {
    $('#beneficiarioModalBtn').click(function (e) {
        e.preventDefault();
        abrirBeneficiariosModal();
    })
})

let modoEdicao = false;
let botaoCondicional = '';
let botaoCancelar = '';
let idEstaticoParaNovoBeneficiario = 0

function abrirBeneficiariosModal() {
    var random = Math.random().toString().replace('.', '');
    var modalContent =
        '<div id="' + random + '" class="modal fade">' +
        '        <div class="modal-dialog" style="width: 50%;">' +
        '            <div class="modal-content">' +
        '                <div class="modal-header">' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '                    <h4 class="modal-title"> Beneficiários </h4>' +
        '                </div>' +
        '                <div class="modal-body">' +
        '                   <form id="formCadastroBeneficiario" method="post">' +
        '                       <div class="row">' +
        '                           <div class="col-md-3">' +
        '                               <div class="form-group">' +
        '                                   <label for="cpf">CPF:</label>' +
        '                                   <input type="text" class="form-control" id="CPF" maxlength="14" placeholder="Ex: 010.011.111-00">' +
        '                               </div>' +
        '                           </div>' +
        '                           <div class="col-md-6">' +
        '                               <div class="form-group">' +
        '                                   <label for="nome">Nome:</label>' +
        '                                   <input type="text" class="form-control" maxlength="50" id="nomeBeneficiario" placeholder="Ex: Maria">' +
        '                               </div>' +
        '                           </div>' +
        '                           <div class="col-md-3" id="botaoCondicional">' +

        '                           </div>' +
        '                       </div>' +
        '                   </form>' +
        '                   <br>' +
        '                   <table class="table">' +
        '                       <thead>' +
        '                           <tr>' +
        '                               <th>CPF</th>' +
        '                               <th>Nome</th>' +
        '                               <th>Ações</th>' +
        '                           </tr>' +
        '                       </thead>' +
        '                       <tbody id="tbodyBeneficiarios">' +
        '                       </tbody>' +
        '                   </table>' +
        '                </div>' +
        '               <div id="alert">' +
        '               </div>' +
        '                <div class="modal-footer">' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '                </div>' +
        '            </div><!-- /.modal-content -->' +
        '  </div><!-- /.modal-dialog -->' +
        '</div> <!-- /.modal -->';

    $('body').append(modalContent);
    $('#' + random).modal('show');
    alterarBeneficiario(random, true, null);

    var beneficiariosSalvos = $('#beneficiariosSalvos').val();
    if (beneficiariosSalvos.length > 0) {
        beneficiariosSalvos = JSON.parse(beneficiariosSalvos)
    }
    if (beneficiariosSalvos && beneficiariosSalvos.length > 0) {
        $.each(beneficiariosSalvos, function (index, beneficiario) {
            var novaLinha =
                '<tr id="' + beneficiario.Id + '">' +
                '   <td id="cpfCampo' + beneficiario.Id + '">' + beneficiario.CPF + '</td>' +
                '   <td id="nomeCampo' + beneficiario.Id + '">' + beneficiario.Nome + '</td>' +
                '   <td>' +
                '       <button type="button" onClick="alterarBeneficiario(\'' + random + '\', false, \'' + beneficiario.CPF + '\')" class="btn btn-primary">Alterar</button>' +
                '       <button type="button" onClick="removerBeneficiario(\'' + beneficiario.CPF + '\', \'' + random + '\')" class="btn btn-danger">Excluir</button>' +
                '   </td>' +
                '</tr>';
            $('#' + random + ' #tbodyBeneficiarios').append(novaLinha);
        });
    }

    $('#' + random + ' #CPF').on('keydown', function (e) {
        var cpf = $(this).val().replace(/\D/g, '');
        cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
        $(this).val(cpf);
    });

    $('#' + random + ' #CPF').on('keypress', function (e) {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    });

    $('#' + random + ' #submitFormBeneficiario').click(function (e) {
        e.preventDefault();
        var cpf = $('#' + random + ' #CPF').val();
        var nome = $('#' + random + ' #nomeBeneficiario').val();

        if (cpf === '' || nome === '') {
            return;
        }

        var novaLinha =
            '<tr id="estatico' + idEstaticoParaNovoBeneficiario + '">' +
            '   <td>' + cpf + '</td>' +
            '   <td>' + nome + '</td>' +
            '   <td>' +
            '       <button type="button" onClick="alterarBeneficiario(\'' + random + '\', false, \'' + cpf + '\')" class="btn btn-primary">Alterar</button>' +
            '       <button type="button" onClick="removerBeneficiario(\'' + cpf + '\', \'' + random + '\')" class="btn btn-danger">Excluir</button>' +
            '   </td>' +
            '</tr>';
        $('#' + random + ' table tbody').append(novaLinha);

        $('#' + random + ' #CPF').val('');
        $('#' + random + ' #nomeBeneficiario').val('');

        atualizarInputHidden(random, idEstaticoParaNovoBeneficiario);
    });
}

function atualizarInputHidden(random, idEstatico) {
    var beneficiarios = [];
    $('#' + random + ' table tbody tr').each(function () {
        var cpf = $(this).find('td:eq(0)').text();
        var nome = $(this).find('td:eq(1)').text();
        beneficiarios.push({ CPF: cpf, Nome: nome, IdDinamico: idEstatico });
    });
    $('#beneficiariosSalvos').val(JSON.stringify(beneficiarios));
}

function removerBeneficiario(cpf, random) {
    var beneficiarios = JSON.parse($('#beneficiariosSalvos').val());
    var index = beneficiarios.findIndex(function (b) { return b.CPF === cpf });
    var beneficiario = beneficiarios[index];
    beneficiarios.splice(index, 1);
    $('#beneficiariosSalvos').val(JSON.stringify(beneficiarios));
    if (beneficiario.Id) {
        $('#' + random + ' table tbody #' + beneficiario.Id + '').remove();
    } else {
        var teste = $('#' + random + ' table tbody #estatico #' + idEstaticoParaNovoBeneficiario + '').remove();
        $('#' + random + ' table tbody #estatico' + idEstaticoParaNovoBeneficiario + '').remove();
    }
}

function alterarBeneficiario(random, inicial, cpf) {
    if (!inicial) {
        modoEdicao = true;
    }

    if (modoEdicao) {
        botaoCondicional = '<button type="button" onClick="salvarAlteracao(\'' + cpf + '\', \'' + random + '\')" id="submitFormBeneficiario" class="btn btn-primary" style="margin-top: 24px;">Salvar</button>';
        botaoCancelar = '<button type="button" onClick="cancelarModoEdicao(\'' + random + '\')" id="cancelar" class="btn btn-secondary" style="margin-top: 24px; margin-right: 5px;">Cancelar</button>';
    } else {
        botaoCondicional = '<button type="button" id="submitFormBeneficiario" class="btn btn-success" style="margin-top: 24px;">Incluir</button>';
    }

    if (inicial) {
        $('#' + random + ' #botaoCondicional').append(botaoCondicional);
    } else {
        $('#' + random + ' #submitFormBeneficiario').remove();
        if ($('#' + random + ' #cancelar').length === 0) {
            $('#' + random + ' #botaoCondicional').append(botaoCancelar);
        }
        $('#' + random + ' #botaoCondicional').append(botaoCondicional);
    }

    if (cpf !== null) {
        var beneficiarios = JSON.parse($('#beneficiariosSalvos').val());
        var index = beneficiarios.findIndex(function (b) { return b.CPF === cpf });
        var beneficiario = beneficiarios[index];

        $('#' + random + ' #CPF').val(beneficiario.CPF)
        $('#' + random + ' #nomeBeneficiario').val(beneficiario.Nome)
    }

    if (!modoEdicao) {
        $('#' + random + ' #CPF').val('')
        $('#' + random + ' #nomeBeneficiario').val('')
    }
}

function salvarAlteracao(cpf, random) {
    var beneficiarios = JSON.parse($('#beneficiariosSalvos').val());

    var index = beneficiarios.findIndex(function (b) { return b.CPF === cpf });

    var cpf = $('#' + random + ' #CPF').val()
    var nome = $('#' + random + ' #nomeBeneficiario').val()

    if (index !== -1) {
        beneficiarios[index].CPF = cpf;
        beneficiarios[index].Nome = nome;

        $('#beneficiariosSalvos').val(JSON.stringify(beneficiarios));

        $('#' + random + '#cpfCampo' + beneficiarios[index].Id).text(cpf);
        $('#' + random + ' #nomeCampo' + beneficiarios[index].Id).text(nome);

        cancelarModoEdicao(random);
        var alertId = 'alert-' + new Date().getTime();
        var alertHtml = `
            <div id="${alertId}" class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 0; left: 0; width: 100%; z-index: 1050;">
                Alterações salvas com sucesso!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        $('#' + random + ' #alert').append(alertHtml);

        // Remove o alerta após 4 segundos
        setTimeout(function () {
            $('#' + alertId).alert('close').remove();
        }, 4000);

    } else {
        console.error('Beneficiário não encontrado na lista:', beneficiario);
    }
}


function cancelarModoEdicao(random) {
    modoEdicao = false;

    var botaoIncluir = '<button type="button" id="submitFormBeneficiario" class="btn btn-success" style="margin-top: 24px;">Incluir</button>';
    $('#' + random + ' #submitFormBeneficiario').remove();
    $('#' + random + ' #cancelar').remove();
    $('#' + random + ' #botaoCondicional').append(botaoIncluir);
    $('#' + random + ' #CPF').val('')
    $('#' + random + ' #nomeBeneficiario').val('')

}