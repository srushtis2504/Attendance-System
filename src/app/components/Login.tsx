import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScanLine, User, GraduationCap, Shield } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roll_no: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignup ? '/api/register' : '/api/login';

    try {
      const response = await fetch('https://bust-glance-statute.ngrok-free.dev' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, ...formData }),
      });

      const data = await response.json();
      if (data.success) {
        if (isSignup) {
          setIsSignup(false);
          setFormData({
            email: '',
            password: '',
            name: '',
            roll_no: '',
          });
          setError('Account created! Please sign in.');
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('role', selectedRole);
          navigate('/' + selectedRole);
        }
      } else {
        setError(data.message || (isSignup ? 'Registration failed' : 'Invalid credentials'));
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const roles = [
    { value: 'student' as const, label: 'Student', icon: GraduationCap },
    { value: 'teacher' as const, label: 'Teacher', icon: User },
  ];

  return (
    <div className='min-h-screen w-full flex items-center justify-center relative overflow-hidden p-6'>
      <div className='absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background' />
      <div className='absolute inset-0 animate-gradient bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5' />
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow' />
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow' style={{ animationDelay: '2s' }} />

      <div className='w-full max-w-md relative z-10 animate-slide-up'>
        <div className='mb-8 text-center'>
          <div className='inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4 hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-110 cursor-pointer'>
            <ScanLine className='h-8 w-8 text-primary-foreground' />
          </div>
          <h1 className='font-heading text-3xl tracking-tight mb-2' style={{ fontWeight: 700 }}>
            AttendEase
          </h1>
          <p className='text-muted-foreground'>
            Smart QR-based attendance management
          </p>
        </div>

        <div className='bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow duration-500'>
          <div className='p-8'>
            <h2 className='font-heading text-xl mb-2' style={{ fontWeight: 600 }}>
              {isSignup ? `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account` : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </h2>
            <p className='text-sm text-muted-foreground mb-6'>
              {isSignup ? 'Please fill in your details to get started' : 'Enter your credentials to access your dashboard'}
            </p>

            <div className='mb-6'>
              <label className='block text-sm font-medium mb-3 text-primary'>1. Select Your Role</label>
              <div className='grid grid-cols-2 gap-2'>
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type='button'
                      onClick={() => {
                        setSelectedRole(role.value);
                        setError('');
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                          : 'border-border hover:border-muted-foreground/30 hover:bg-accent/50'
                      }`}
                    >
                      <Icon className='h-5 w-5' />
                      <span className='text-xs font-medium'>{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className={error.includes('created') ? 'text-green-500 text-sm mb-4 text-center p-2 bg-green-500/10 rounded-lg' : 'text-destructive text-sm mb-4 text-center p-2 bg-destructive/10 rounded-lg'}>{error}</p>}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='text-sm font-medium text-primary mb-2'>2. {isSignup ? 'Registration Details' : 'Login Details'}</div>
              
              {(isSignup || selectedRole === 'student') && (
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    {selectedRole === 'student' ? 'Student Full Name' : 'Teacher Full Name'}
                  </label>
                  <input
                    type='text'
                    placeholder='John Doe'
                    className='w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              {selectedRole === 'student' && (
                <div>
                  <label className='block text-sm font-medium mb-2'>Roll Number (e.g. S101)</label>
                  <input
                    type='text'
                    placeholder='S101'
                    className='w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]'
                    value={formData.roll_no}
                    onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                    required
                  />
                </div>
              )}

              {(selectedRole === 'teacher' || isSignup) && (
                <div>
                  <label className='block text-sm font-medium mb-2'>Email Address</label>
                  <input
                    type='email'
                    placeholder='name@college.com'
                    className='w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium mb-2'>Password</label>
                <input
                  type='password'
                  placeholder='••••••••'
                  className='w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 ripple-effect'
              >
                {isSignup ? 'Create My Account' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className='mt-6 text-center pt-4 border-t border-border'>
              <button
                type='button'
                onClick={() => setIsSignup(!isSignup)}
                className='text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105'
              >
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <span className='text-primary font-bold'>
                  {isSignup ? 'Sign In' : 'Create One Now'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
