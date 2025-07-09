from database.models import User

def testNewUser(): 
    user = User('prayingMantis', 'biteHead')
    assert user.username == 'prayingMantis'
    assert user.password != 'biteHead'
    assert user.checkPassword('biteHead')