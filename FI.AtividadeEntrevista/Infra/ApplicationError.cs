using System;

namespace FI.AtividadeEntrevista.Infra
{
    public class ApplicationError : Exception
    {
        public ApplicationError(string error) : base(error)
        {
            
        }
    }
}
