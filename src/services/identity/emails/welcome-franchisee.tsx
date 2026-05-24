interface WelcomeFranchiseeEmailProps {
  fullName: string;
  resetUrl: string;
  brandLogoUrl?: string;
}

/**
 * Template do e-mail de boas-vindas ao franqueado.
 *
 * Renderizado para HTML inline via React (sem react-email pra evitar
 * dependência extra no MVP). Usa CSS inline pra compatibilidade ampla com
 * clients de e-mail (Gmail, Outlook, Apple Mail).
 *
 * Mobile-responsive via media query no <style>, mas o layout principal já é
 * baseado em max-width:520px que cabe em qualquer cliente.
 */
export function WelcomeFranchiseeEmail({
  fullName,
  resetUrl,
  brandLogoUrl,
}: WelcomeFranchiseeEmailProps): JSX.Element {
  const firstName = fullName.split(' ')[0] ?? fullName;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Bem-vindo(a) à iGNYX Lease</title>
        <style>{`
          @media (max-width: 600px) {
            .container { width: 100% !important; padding: 16px !important; }
            .button { width: 100% !important; box-sizing: border-box; }
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#FBFBFC',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#0B0E14',
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ backgroundColor: '#FBFBFC', padding: '32px 0' }}
        >
          <tr>
            <td align="center">
              <table
                className="container"
                width={520}
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{
                  width: 520,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 4px 12px -2px rgba(11,14,20,0.06)',
                }}
              >
                <tr>
                  <td>
                    {brandLogoUrl ? (
                      <img
                        src={brandLogoUrl}
                        alt="iGNYX Lease"
                        height={44}
                        style={{ display: 'block', height: 44 }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: '#0C2452',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        iGNYX <span style={{ color: '#55B1AC', fontWeight: 500 }}>Lease</span>
                      </div>
                    )}

                    <h1
                      style={{
                        margin: '24px 0 8px',
                        fontSize: 24,
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Olá, {firstName} 👋
                    </h1>

                    <p style={{ margin: '0 0 16px', color: '#494E59', lineHeight: 1.55 }}>
                      Seja muito bem-vindo(a) à rede <strong>Maff Franchising</strong>.
                      Sua conta na plataforma <strong>iGNYX Lease</strong> foi criada com sucesso.
                    </p>

                    <p style={{ margin: '0 0 24px', color: '#494E59', lineHeight: 1.55 }}>
                      Para começar, defina sua senha clicando no botão abaixo. O link é
                      pessoal e dá acesso ao seu painel de franqueado.
                    </p>

                    <table cellPadding={0} cellSpacing={0} role="presentation">
                      <tr>
                        <td
                          align="center"
                          style={{
                            backgroundColor: '#0C2452',
                            borderRadius: 10,
                          }}
                        >
                          <a
                            href={resetUrl}
                            className="button"
                            style={{
                              display: 'inline-block',
                              padding: '14px 28px',
                              color: '#FFFFFF',
                              fontWeight: 600,
                              fontSize: 14,
                              textDecoration: 'none',
                              letterSpacing: '0.01em',
                            }}
                          >
                            Definir minha senha
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style={{
                        margin: '24px 0 0',
                        fontSize: 12,
                        color: '#6C7280',
                        lineHeight: 1.55,
                      }}
                    >
                      Se o botão não funcionar, copie e cole este link no navegador:
                      <br />
                      <span style={{ wordBreak: 'break-all', color: '#3F9ECE' }}>{resetUrl}</span>
                    </p>

                    <hr
                      style={{
                        margin: '32px 0 16px',
                        border: 'none',
                        borderTop: '1px solid #ECECEF',
                      }}
                    />

                    <p style={{ margin: 0, fontSize: 12, color: '#9CA1AB', lineHeight: 1.6 }}>
                      Você está recebendo este e-mail porque foi cadastrado como
                      franqueado(a) na rede Maff. Em caso de dúvidas, fale com a equipe
                      de suporte respondendo a este e-mail.
                    </p>
                  </td>
                </tr>
              </table>

              <p style={{ margin: '24px 0 0', fontSize: 11, color: '#9CA1AB' }}>
                © {new Date().getFullYear()} Maff Franchising — iGNYX Lease
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
