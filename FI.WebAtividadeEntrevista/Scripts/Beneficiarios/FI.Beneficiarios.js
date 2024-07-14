$(document).ready(function () {
    $('#beneficiarioModalBtn').click(function (e) {
        e.preventDefault();
        abrirBeneficiariosModal();
    })
})

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
        '                           <div class="col-md-4">' +
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
        '                           <div class="col-md-2">' +
        '                               <button type="button" id="submitFormBeneficiario" class="btn btn-success" style="margin-top: 24px;">Incluir</button>' +
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
        '                <div class="modal-footer">' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '                </div>' +
        '            </div><!-- /.modal-content -->' +
        '  </div><!-- /.modal-dialog -->' +
        '</div> <!-- /.modal -->';

    $('body').append(modalContent);
    $('#' + random).modal('show');
    
    var beneficiariosSalvos = $('#beneficiariosSalvos').val();
    if (beneficiariosSalvos.length > 0) {
        beneficiariosSalvos = JSON.parse(beneficiariosSalvos)
    }
    if (beneficiariosSalvos && beneficiariosSalvos.length > 0) {
        $.each(beneficiariosSalvos, function (index, beneficiario) {
            var novaLinha =
                '<tr>' +
                '   <td>' + beneficiario.CPF + '</td>' +
                '   <td>' + beneficiario.Nome + '</td>' +
                '   <td>' +
                '       <button type="button" class="btn btn-primary">Alterar</button>' +
                '       <button type="button" class="btn btn-danger">Excluir</button>' +
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

        var novaLinha =
            '<tr>' +
            '   <td>' + cpf + '</td>' +
            '   <td>' + nome + '</td>' +
            '   <td>' +
            '       <button type="button" class="btn btn-primary">Alterar</button>' +
            '       <button type="button" class="btn btn-danger">Excluir</button>' +
            '   </td>' +
            '</tr>';
        $('#' + random + ' table tbody').append(novaLinha);

        $('#' + random + ' #CPF').val('');
        $('#' + random + ' #nomeBeneficiario').val('');

        atualizarInputHidden(random);
    });
}

function atualizarInputHidden(random) {
    var beneficiarios = [];
    $('#' + random + ' table tbody tr').each(function () {
        var cpf = $(this).find('td:eq(0)').text();
        var nome = $(this).find('td:eq(1)').text();
        beneficiarios.push({ CPF: cpf, Nome: nome });
    });
    $('#beneficiariosSalvos').val(JSON.stringify(beneficiarios));
}