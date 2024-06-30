export const registrationEmail = (name: string) => {
  return `<html>
            <body>
              <div>
                <p>Hi ${name}!</p>
                <p>You did it! You registered!, You're successfully registered.✔</p>
              </div>
            </body>
          </html>
  `;
};

export const forgotPasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>Request Reset Password Successfully!  ✔</p>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};

export const changePasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>Change Password Successfully! ✔ </p>
                <p>this is your new password: ${password}</p>
              </div>
            </body>
          </html>
  `;
};
