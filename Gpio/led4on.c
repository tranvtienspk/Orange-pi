#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (0, OUTPUT) ;
  digitalWrite (0,  LOW) ; delay (10) ;  
  return 0 ;
}