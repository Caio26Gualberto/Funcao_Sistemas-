using System.ComponentModel.DataAnnotations;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        /// <summary>
        /// Identificador do beneficiário
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Nome do beneficiário
        /// </summary>
        [Required]
        [MaxLength(50, ErrorMessage = "Nome muito extenso")]
        public string Nome { get; set; }

        /// <summary>
        /// CPF do beneficiario
        /// </summary>
        [Required]
        [MaxLength(14, ErrorMessage = "CPF inválido")]
        public string CPF { get; set; }

        /// <summary>
        /// Identificador único que liga o beneficiário ao cliente
        /// </summary>
        public long IdCliente { get; set; }
    }
}