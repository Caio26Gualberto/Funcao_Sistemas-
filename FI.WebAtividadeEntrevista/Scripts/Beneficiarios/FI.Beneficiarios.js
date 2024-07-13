$(document).ready(function () {
    $('#beneficiarioModalBtn').click(function (e) {
        e.preventDefault();
        abrirBeneficiariosModal();
    })
    $('#CPF').on('keydown', function (e) {
        var cpf = $(this).val().replace(/\D/g, '');
        cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
        $(this).val(cpf);
    });

    $('#CPF').on('keypress', function (e) {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    });
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
        '                                   <input type="text" class="form-control" id="CPF" placeholder="Ex: 010.011.111-00">' +
        '                               </div>' +
        '                           </div>' +
        '                           <div class="col-md-6">' +
        '                               <div class="form-group">' +
        '                                   <label for="nome">Nome:</label>' +
        '                                   <input type="text" class="form-control" id="nomeBeneficiario" placeholder="Ex: Maria">' +
        '                               </div>' +
        '                           </div>' +
        '                           <div class="col-md-2">' +
        '                               <button type="submit" class="btn btn-success" style="margin-top: 24px;">Incluir</button>' +
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
        '                       <tbody>' +
        '                           <tr>' +
        '                               <td>000.000.001-91</td>' +
        '                               <td>Beneficiário João</td>' +
        '                               <td>' +
        '                                   <button type="button" class="btn btn-primary">Alterar</button>' +
        '                                   <button type="button" class="btn btn-danger">Excluir</button>' +
        '                               </td>' +
        '                           </tr>' +
        '                           <tr>' +
        '                               <td>000.000.002-72</td>' +
        '                               <td>Beneficiário José</td>' +
        '                               <td>' +
        '                                   <button type="button" class="btn btn-primary">Alterar</button>' +
        '                                   <button type="button" class="btn btn-danger">Excluir</button>' +
        '                               </td>' +
        '                           </tr>' +
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
}